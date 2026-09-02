"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { CategoryNode, PostSummary } from "@/lib/blog";

const POSTS_PER_PAGE = 6;

type BlogHomeProps = {
  posts: PostSummary[];
  categories: ReadonlyArray<CategoryNode>;
};

function matchesCategory(post: PostSummary, category: string): boolean {
  if (category === "all") return true;
  return category.includes("/") ? post.category === category : post.majorCategory === category;
}

export default function BlogHome({ posts, categories }: BlogHomeProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const syncCategory = () => {
      const requested = new URLSearchParams(window.location.search).get("category");
      setActiveCategory(requested || "all");
    };
    const timer = window.setTimeout(syncCategory, 0);
    window.addEventListener("popstate", syncCategory);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("popstate", syncCategory);
    };
  }, []);

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("ko");
    return posts.filter((post) => {
      if (!matchesCategory(post, activeCategory)) return false;
      if (!normalizedQuery) return true;
      return `${post.title} ${post.description} ${post.category} ${post.searchText}`
        .toLocaleLowerCase("ko")
        .includes(normalizedQuery);
    });
  }, [activeCategory, posts, query]);

  const pageCount = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const visiblePosts = filteredPosts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  function chooseCategory(category: string) {
    setActiveCategory(category);
    setPage(1);
    const nextUrl = category === "all" ? "/" : `/?category=${encodeURIComponent(category)}`;
    window.history.replaceState({}, "", nextUrl);
  }

  function choosePage(nextPage: number) {
    setPage(nextPage);
    document.querySelector("#content")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const archiveTitle = activeCategory === "all" ? "Recent posts" : activeCategory;

  return (
    <div className="site-frame">
      <a className="skip-link" href="#content">본문으로 바로가기</a>

      <header className="masthead">
        <Link className="site-title" href="/">이산재혁</Link>
        <nav aria-label="주요 메뉴">
          <a href="#categories">Categories</a>
          <a href="https://isanjaehyuk.tistory.com/tag" target="_blank" rel="noreferrer">Tags</a>
        </nav>
      </header>

      <div className="page-grid">
        <aside className="sidebar">
          <div className="profile">
            <Image src="/profile.jpg" alt="억새밭에 서 있는 이산재혁" width={112} height={112} priority />
            <h1>이산재혁</h1>
            <p>배우고, 만들고, 기록합니다.</p>
            <div className="profile-links">
              <a href="https://github.com/IsanBrandon" target="_blank" rel="noreferrer">GitHub</a>
              <a href="https://isanjaehyuk.tistory.com/" target="_blank" rel="noreferrer">Tistory</a>
            </div>
          </div>

          <nav className="category-nav" id="categories" aria-label="카테고리">
            <button
              className={`all-posts ${activeCategory === "all" ? "is-active" : ""}`}
              type="button"
              onClick={() => chooseCategory("all")}
              aria-pressed={activeCategory === "all"}
            >
              <span>📂 전체 게시글</span><strong>{posts.length}</strong>
            </button>
            {categories.map((category) => (
              <section key={category.name}>
                <button
                  className={`category-parent ${activeCategory === category.name ? "is-active" : ""}`}
                  type="button"
                  onClick={() => chooseCategory(category.name)}
                  aria-pressed={activeCategory === category.name}
                >
                  <span>{category.icon} {category.name}</span><strong>{category.count}</strong>
                </button>
                <div className="category-children">
                  {category.children.map((child) => {
                    const key = `${category.name}/${child.name}`;
                    return (
                      <button
                        className={activeCategory === key ? "is-active" : ""}
                        type="button"
                        onClick={() => chooseCategory(key)}
                        aria-pressed={activeCategory === key}
                        key={key}
                      >
                        <span>{child.name}</span><em>{child.count}</em>
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}
          </nav>
        </aside>

        <main id="content" className="main-content">
          <div className="archive-header">
            <div>
              <p>Archive</p>
              <h2>{archiveTitle}</h2>
              <span>{filteredPosts.length}개의 기록</span>
            </div>
            <label className="search-field">
              <span className="sr-only">글 검색</span>
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="6.5" />
                <path d="m16 16 4 4" />
              </svg>
              <input
                type="search"
                value={query}
                placeholder="검색어를 입력하세요"
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
              />
            </label>
          </div>

          {visiblePosts.length ? (
            <div className="post-list">
              {visiblePosts.map((post) => (
                <article className="post-preview" key={post.id}>
                  <Link href={`/posts/${post.id}/`}>
                    <h3>{post.title}</h3>
                  </Link>
                  <div className="post-meta">
                    <time dateTime={post.published}>{post.dateLabel}</time>
                    <button type="button" onClick={() => chooseCategory(post.category)}>
                      {post.category.replace("/", " / ")}
                    </button>
                  </div>
                  <p>{post.description || "티스토리에서 옮겨온 기록입니다."}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <strong>찾는 글이 없습니다.</strong>
              <p>검색어를 바꾸거나 전체 게시글을 선택해 보세요.</p>
              <button type="button" onClick={() => { setQuery(""); chooseCategory("all"); }}>전체 글 보기</button>
            </div>
          )}

          {pageCount > 1 && (
            <nav className="pagination" aria-label="페이지 이동">
              <button type="button" onClick={() => choosePage(Math.max(1, page - 1))} disabled={page === 1} aria-label="이전 페이지">‹</button>
              {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
                <button
                  className={pageNumber === page ? "is-current" : ""}
                  type="button"
                  onClick={() => choosePage(pageNumber)}
                  aria-current={pageNumber === page ? "page" : undefined}
                  key={pageNumber}
                >
                  {pageNumber}
                </button>
              ))}
              <button type="button" onClick={() => choosePage(Math.min(pageCount, page + 1))} disabled={page === pageCount} aria-label="다음 페이지">›</button>
            </nav>
          )}
        </main>
      </div>

      <footer>
        <span>© 2026 이산재혁</span>
        <span>Built with Next.js · Hosted on GitHub Pages</span>
      </footer>
    </div>
  );
}
