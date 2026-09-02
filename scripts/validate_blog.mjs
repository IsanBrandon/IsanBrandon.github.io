import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const posts = JSON.parse(fs.readFileSync(path.join(root, "data", "tistory-posts.json"), "utf8"));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(posts.length === 77, `Expected 77 posts, received ${posts.length}`);
assert(posts.every((post) => post.id && post.title && post.published && post.category && post.content), "A post is missing a required field");

const referencedAssets = new Set();
for (const post of posts) {
  for (const match of post.content.matchAll(/(?:src|href)="\/(tistory-(?:images|files)\/[^"?#]+)"/g)) {
    referencedAssets.add(match[1]);
  }
}

const missingAssets = [...referencedAssets].filter((asset) => !fs.existsSync(path.join(root, "public", asset)));
assert(missingAssets.length === 0, `Missing assets:\n${missingAssets.join("\n")}`);
assert(!JSON.stringify(posts).includes("blog.kakaocdn.net"), "An expiring Kakao CDN URL remains in the imported content");

const rootHtml = fs.readFileSync(path.join(root, "out", "index.html"), "utf8");
const noImagePostHtml = fs.readFileSync(path.join(root, "out", "posts", "108", "index.html"), "utf8");
const imagePostHtml = fs.readFileSync(path.join(root, "out", "posts", "15", "index.html"), "utf8");

assert(rootHtml.includes("이산재혁"), "The homepage title is missing");
assert(rootHtml.includes("https://isanbrandon.github.io/og.png"), "The homepage Open Graph image is missing");
assert(!noImagePostHtml.includes('property="og:image"'), "A post without an image inherited the generic Open Graph image");
assert(imagePostHtml.includes("https://isanbrandon.github.io/tistory-images/15/01.png"), "The article-specific Open Graph image is missing");
assert(imagePostHtml.includes('src="/tistory-images/15/01.png"'), "The article body is not using the local image asset");

const staticPostCount = fs
  .readdirSync(path.join(root, "out", "posts"), { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && /^\d+$/.test(entry.name)).length;
assert(staticPostCount === posts.length, `Expected ${posts.length} static post pages, received ${staticPostCount}`);

console.log(`Validated ${posts.length} posts, ${referencedAssets.size} local assets, and ${staticPostCount} static article pages.`);
