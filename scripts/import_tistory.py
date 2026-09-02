"""Import every public Tistory post into the static blog data set.

The importer keeps the original HTML structure, removes executable markup,
rewrites links between imported posts, and downloads article images so the
GitHub Pages copy does not depend on expiring Tistory image signatures.
"""

from __future__ import annotations

import argparse
import concurrent.futures
import html
from html.parser import HTMLParser
import json
import mimetypes
import os
from pathlib import Path
import re
import subprocess
import ssl
import sys
import time
from typing import Iterable
from urllib.error import HTTPError, URLError
from urllib.parse import urljoin, urlparse
from urllib.request import Request, urlopen
import xml.etree.ElementTree as ET


BASE_URL = "https://isanjaehyuk.tistory.com"
ROOT = Path(__file__).resolve().parents[1]
OUTPUT_PATH = ROOT / "data" / "tistory-posts.json"
IMAGE_ROOT = ROOT / "public" / "tistory-images"
FILE_ROOT = ROOT / "public" / "tistory-files"
USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36"
)
TIMEOUT_SECONDS = 45


def fetch(url: str, attempts: int = 3, referer: str | None = None) -> tuple[bytes, str]:
    headers = {
        "User-Agent": USER_AGENT,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
        "Cache-Control": "no-cache",
    }
    if referer:
        headers["Accept"] = "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8"
        headers["Referer"] = referer
        headers["Sec-Fetch-Dest"] = "image"
        headers["Sec-Fetch-Mode"] = "no-cors"
        headers["Sec-Fetch-Site"] = "cross-site"
    request = Request(url, headers=headers)
    last_error: Exception | None = None
    for attempt in range(attempts):
        try:
            with urlopen(request, timeout=TIMEOUT_SECONDS, context=ssl.create_default_context()) as response:
                return response.read(), response.headers.get("Content-Type", "")
        except (HTTPError, URLError, TimeoutError) as error:
            last_error = error
            if attempt + 1 < attempts:
                time.sleep(1.5 * (attempt + 1))
    raise RuntimeError(f"Failed to fetch {url}: {last_error}")


class ArticleExtractor(HTMLParser):
    """Extract the inner HTML of Tistory's article body container."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=False)
        self.capturing = False
        self.depth = 0
        self.parts: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        classes = dict(attrs).get("class", "") or ""
        class_names = classes.split()
        if not self.capturing and tag == "div" and (
            "tt_article_useless_p_margin" in class_names or "contents_style" in class_names
        ):
            self.capturing = True
            self.depth = 1
            return
        if self.capturing:
            if tag == "div":
                self.depth += 1
            self.parts.append(self.get_starttag_text())

    def handle_startendtag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if self.capturing:
            self.parts.append(self.get_starttag_text())

    def handle_endtag(self, tag: str) -> None:
        if not self.capturing:
            return
        if tag == "div":
            self.depth -= 1
            if self.depth == 0:
                self.capturing = False
                return
        self.parts.append(f"</{tag}>")

    def handle_data(self, data: str) -> None:
        if self.capturing:
            self.parts.append(data)

    def handle_entityref(self, name: str) -> None:
        if self.capturing:
            self.parts.append(f"&{name};")

    def handle_charref(self, name: str) -> None:
        if self.capturing:
            self.parts.append(f"&#{name};")

    def handle_comment(self, data: str) -> None:
        return


ALLOWED_TAGS = {
    "a", "b", "blockquote", "br", "code", "del", "details", "div", "em",
    "figcaption", "figure", "h1", "h2", "h3", "h4", "h5", "h6", "hr",
    "i", "iframe", "img", "li", "mark", "ol", "p", "pre", "s", "small",
    "span", "strong", "sub", "summary", "sup", "table", "tbody", "td",
    "th", "thead", "tr", "u", "ul", "video", "source",
}
VOID_TAGS = {"br", "hr", "img", "source"}
DROP_WITH_CONTENT = {"script", "style", "noscript", "form", "button", "input", "object"}
GLOBAL_ATTRS = {"class", "id", "title", "lang", "dir"}
TAG_ATTRS = {
    "a": {"href", "target", "rel"},
    "img": {"src", "alt", "width", "height", "loading"},
    "iframe": {"src", "title", "width", "height", "allow", "allowfullscreen"},
    "video": {"src", "controls", "poster", "width", "height"},
    "source": {"src", "type"},
    "td": {"colspan", "rowspan"},
    "th": {"colspan", "rowspan", "scope"},
}


def normalize_remote_url(value: str) -> str:
    value = html.unescape(value.strip())
    if value.startswith("//"):
        return f"https:{value}"
    return urljoin(BASE_URL, value)


class ArticleSanitizer(HTMLParser):
    def __init__(self, image_map: dict[str, str]) -> None:
        super().__init__(convert_charrefs=True)
        self.image_map = image_map
        self.parts: list[str] = []
        self.drop_stack: list[str] = []

    def _safe_url(self, value: str, tag: str) -> str | None:
        if value.startswith(("/tistory-images/", "/tistory-files/", "/posts/")):
            return value
        value = normalize_remote_url(value)
        parsed = urlparse(value)
        if parsed.scheme not in {"http", "https"}:
            return None
        if tag == "iframe" and not any(
            host in parsed.netloc for host in ("youtube.com", "youtube-nocookie.com", "player.vimeo.com")
        ):
            return None
        numeric_post = re.fullmatch(r"/([0-9]+)/?", parsed.path) if parsed.netloc == "isanjaehyuk.tistory.com" else None
        if tag == "a" and numeric_post:
            return f"/posts/{numeric_post.group(1)}/"
        return value

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        tag = tag.lower()
        if self.drop_stack:
            if tag == self.drop_stack[-1]:
                self.drop_stack.append(tag)
            return
        if tag in DROP_WITH_CONTENT:
            self.drop_stack.append(tag)
            return
        if tag not in ALLOWED_TAGS:
            return

        raw = {name.lower(): value for name, value in attrs if value is not None}
        if tag == "img":
            candidate = raw.get("data-src") or raw.get("src")
            if candidate:
                remote = normalize_remote_url(candidate)
                if remote in self.image_map and not self.image_map[remote]:
                    return
                raw["src"] = self.image_map.get(remote, remote)
            raw.setdefault("loading", "lazy")
        elif tag == "a" and raw.get("href"):
            remote = normalize_remote_url(raw["href"])
            if remote in self.image_map:
                if not self.image_map[remote]:
                    return
                raw["href"] = self.image_map[remote]

        allowed = GLOBAL_ATTRS | TAG_ATTRS.get(tag, set())
        clean: list[tuple[str, str]] = []
        for name, value in raw.items():
            if name not in allowed or name.startswith("on"):
                continue
            if name in {"href", "src", "poster"}:
                safe = self._safe_url(value, tag)
                if not safe:
                    continue
                value = safe
            clean.append((name, value))

        if tag == "a" and any(name == "target" and value == "_blank" for name, value in clean):
            clean = [(name, value) for name, value in clean if name != "rel"]
            clean.append(("rel", "noreferrer"))

        attrs_html = "".join(
            f' {name}="{html.escape(value, quote=True)}"' if value else f" {name}"
            for name, value in clean
        )
        self.parts.append(f"<{tag}{attrs_html}>")

    def handle_startendtag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self.handle_starttag(tag, attrs)

    def handle_endtag(self, tag: str) -> None:
        tag = tag.lower()
        if self.drop_stack:
            if tag == self.drop_stack[-1]:
                self.drop_stack.pop()
            return
        if tag in ALLOWED_TAGS and tag not in VOID_TAGS:
            self.parts.append(f"</{tag}>")

    def handle_data(self, data: str) -> None:
        if not self.drop_stack:
            self.parts.append(html.escape(data, quote=False))


def find_meta(page_html: str, key: str) -> str:
    patterns = [
        rf'<meta[^>]+property=["\']{re.escape(key)}["\'][^>]+content=["\'](.*?)["\'][^>]*>',
        rf'<meta[^>]+content=["\'](.*?)["\'][^>]+property=["\']{re.escape(key)}["\'][^>]*>',
    ]
    for pattern in patterns:
        match = re.search(pattern, page_html, flags=re.IGNORECASE | re.DOTALL)
        if match:
            return html.unescape(match.group(1).strip())
    return ""


def extract_article(page_html: str) -> str:
    parser = ArticleExtractor()
    parser.feed(page_html)
    content = "".join(parser.parts).strip()
    if not content:
        raise RuntimeError("Article body container was not found")
    return content


def extract_image_urls(article_html: str) -> list[str]:
    candidates = re.findall(
        r'<img\b[^>]*?\s(?:data-src|src)=["\'](.*?)["\']',
        article_html,
        flags=re.IGNORECASE,
    )
    result: list[str] = []
    for value in candidates:
        remote = normalize_remote_url(value)
        if remote.startswith("http") and remote not in result:
            result.append(remote)
    return result


def extract_attachment_urls(article_html: str) -> list[str]:
    candidates = re.findall(r'<a\b[^>]*?\shref=["\'](.*?)["\']', article_html, flags=re.IGNORECASE)
    result: list[str] = []
    for value in candidates:
        remote = normalize_remote_url(value)
        suffix = Path(urlparse(remote).path).suffix.lower()
        if "blog.kakaocdn.net" not in urlparse(remote).netloc:
            continue
        if suffix in {".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"}:
            continue
        if remote not in result:
            result.append(remote)
    return result


def image_extension(url: str, content_type: str) -> str:
    path_suffix = Path(urlparse(url).path).suffix.lower()
    if path_suffix in {".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"}:
        return ".jpg" if path_suffix == ".jpeg" else path_suffix
    mime = content_type.split(";", 1)[0].strip().lower()
    guessed = mimetypes.guess_extension(mime) or ".jpg"
    return ".jpg" if guessed == ".jpe" else guessed


def download_images(post_id: str, urls: Iterable[str], enabled: bool) -> tuple[dict[str, str], int]:
    mapping: dict[str, str] = {}
    downloaded_bytes = 0
    if not enabled:
        return mapping, downloaded_bytes

    post_dir = IMAGE_ROOT / post_id
    post_dir.mkdir(parents=True, exist_ok=True)
    for index, url in enumerate(urls, start=1):
        destination: Path | None = None
        try:
            suffix = image_extension(url, "")
            destination = post_dir / f"{index:02d}{suffix}"
            if destination.exists() and destination.stat().st_size != 10894:
                mapping[url] = f"/tistory-images/{post_id}/{destination.name}"
                downloaded_bytes += destination.stat().st_size
                continue
            if os.name == "nt":
                helper = ROOT / "scripts" / "download_tistory_image.ps1"
                result = subprocess.run(
                    [
                        "powershell.exe", "-NoLogo", "-NoProfile", "-ExecutionPolicy", "Bypass",
                        "-File", str(helper), "-Url", url, "-Referer", f"{BASE_URL}/{post_id}",
                        "-Destination", str(destination),
                    ],
                    capture_output=True,
                    text=True,
                    encoding="utf-8",
                    errors="replace",
                    timeout=TIMEOUT_SECONDS,
                    check=False,
                )
                if result.returncode != 0:
                    raise RuntimeError(result.stderr.strip() or "PowerShell image download failed")
                payload_size = destination.stat().st_size
            else:
                payload, _ = fetch(url, referer=f"{BASE_URL}/{post_id}")
                destination.write_bytes(payload)
                payload_size = len(payload)
            mapping[url] = f"/tistory-images/{post_id}/{destination.name}"
            downloaded_bytes += payload_size
        except (RuntimeError, OSError, subprocess.SubprocessError) as error:
            mapping[url] = ""
            if destination and destination.exists():
                destination.unlink()
            print(f"[image warning] {post_id}: {error}", file=sys.stderr)
    return mapping, downloaded_bytes


def download_attachments(post_id: str, urls: Iterable[str], enabled: bool) -> tuple[dict[str, str], int]:
    mapping: dict[str, str] = {}
    downloaded_bytes = 0
    if not enabled:
        return mapping, downloaded_bytes

    post_dir = FILE_ROOT / post_id
    post_dir.mkdir(parents=True, exist_ok=True)
    for index, url in enumerate(urls, start=1):
        destination: Path | None = None
        try:
            suffix = Path(urlparse(url).path).suffix.lower() or ".bin"
            destination = post_dir / f"{index:02d}{suffix}"
            if not destination.exists():
                helper = ROOT / "scripts" / "download_tistory_image.ps1"
                result = subprocess.run(
                    [
                        "powershell.exe", "-NoLogo", "-NoProfile", "-ExecutionPolicy", "Bypass",
                        "-File", str(helper), "-Url", url, "-Referer", f"{BASE_URL}/{post_id}",
                        "-Destination", str(destination),
                    ],
                    capture_output=True,
                    text=True,
                    encoding="utf-8",
                    errors="replace",
                    timeout=TIMEOUT_SECONDS,
                    check=False,
                )
                if result.returncode != 0:
                    raise RuntimeError(result.stderr.strip() or "Attachment download failed")
            mapping[url] = f"/tistory-files/{post_id}/{destination.name}"
            downloaded_bytes += destination.stat().st_size
        except (RuntimeError, OSError, subprocess.SubprocessError) as error:
            mapping[url] = ""
            if destination and destination.exists():
                destination.unlink()
            print(f"[attachment warning] {post_id}: {error}", file=sys.stderr)
    return mapping, downloaded_bytes


def parse_post(url: str, download_media: bool) -> tuple[dict[str, object], int]:
    payload, _ = fetch(url)
    page_html = payload.decode("utf-8", errors="replace")
    post_id = url.rstrip("/").rsplit("/", 1)[-1]
    raw_article = extract_article(page_html)

    entry_match = re.search(r"window\.T\.entryInfo\s*=\s*(\{.*?\});", page_html, flags=re.DOTALL)
    entry_info = json.loads(entry_match.group(1)) if entry_match else {}
    category = str(entry_info.get("categoryLabel", "Uncategorized"))
    category_parts = category.split("/", 1)
    title = find_meta(page_html, "og:title") or f"Post {post_id}"
    published = find_meta(page_html, "article:published_time")
    description = re.sub(r"\s+", " ", find_meta(page_html, "og:description")).strip()
    if len(description) > 260:
        description = description[:257].rstrip() + "..."

    image_urls = extract_image_urls(raw_article)
    image_map, downloaded_bytes = download_images(post_id, image_urls, download_media)
    attachment_urls = extract_attachment_urls(raw_article)
    attachment_map, attachment_bytes = download_attachments(post_id, attachment_urls, download_media)
    asset_map = {**image_map, **attachment_map}
    sanitizer = ArticleSanitizer(asset_map)
    sanitizer.feed(raw_article)
    content = "".join(sanitizer.parts).strip()

    post: dict[str, object] = {
        "id": post_id,
        "title": title,
        "published": published,
        "category": category,
        "majorCategory": category_parts[0],
        "subCategory": category_parts[1] if len(category_parts) > 1 else "",
        "description": description,
        "content": content,
        "sourceUrl": url,
        "image": next((value for value in image_map.values() if value), ""),
    }
    return post, downloaded_bytes + attachment_bytes


def sitemap_post_urls() -> list[str]:
    payload, _ = fetch(f"{BASE_URL}/sitemap.xml")
    root = ET.fromstring(payload)
    namespace = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    urls = [element.text or "" for element in root.findall("sm:url/sm:loc", namespace)]
    return [url for url in urls if re.fullmatch(rf"{re.escape(BASE_URL)}/[0-9]+", url)]


def main() -> None:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    parser = argparse.ArgumentParser(description="Import public posts from isanjaehyuk.tistory.com")
    parser.add_argument("--skip-images", action="store_true", help="Keep remote article image URLs")
    parser.add_argument("--workers", type=int, default=6, help="Concurrent page downloads")
    args = parser.parse_args()

    urls = sitemap_post_urls()
    print(f"Found {len(urls)} public posts")
    posts: list[dict[str, object]] = []
    image_bytes = 0
    failures: list[str] = []

    with concurrent.futures.ThreadPoolExecutor(max_workers=max(1, args.workers)) as executor:
        futures = {executor.submit(parse_post, url, not args.skip_images): url for url in urls}
        for index, future in enumerate(concurrent.futures.as_completed(futures), start=1):
            url = futures[future]
            try:
                post, post_image_bytes = future.result()
                posts.append(post)
                image_bytes += post_image_bytes
                print(f"[{index:02d}/{len(urls)}] imported {post['id']}: {post['title']}")
            except Exception as error:  # noqa: BLE001 - report all import failures together
                failures.append(f"{url}: {error}")
                print(f"[{index:02d}/{len(urls)}] failed {url}: {error}", file=sys.stderr)

    if failures:
        raise RuntimeError("Import did not complete:\n" + "\n".join(failures))

    posts.sort(key=lambda post: (str(post["published"]), int(str(post["id"]))), reverse=True)
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(posts, ensure_ascii=False, indent=2), encoding="utf-8")

    counts: dict[str, int] = {}
    for post in posts:
        counts[str(post["category"])] = counts.get(str(post["category"]), 0) + 1
    print(f"Wrote {OUTPUT_PATH.relative_to(ROOT)} with {len(posts)} posts")
    print(f"Downloaded {image_bytes / 1024 / 1024:.1f} MiB of article images")
    print(json.dumps(counts, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
