import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { categories, categoryHref, formatPostDate, posts } from "@/lib/blog";

type PostPageProps = {
  params: Promise<{ id: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return posts.map((post) => ({ id: post.id }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { id } = await params;
  const post = posts.find((item) => item.id === id);
  if (!post) return {};

  const url = `https://isanbrandon.github.io/posts/${post.id}/`;
  const image = post.image
    ? post.image.startsWith("http") ? post.image : new URL(post.image, "https://isanbrandon.github.io").toString()
    : "";

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      locale: "ko_KR",
      url,
      title: post.title,
      description: post.description,
      publishedTime: post.published,
      images: image ? [{ url: image, alt: post.title }] : [],
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: post.title,
      description: post.description,
      images: image ? [image] : [],
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;
  const postIndex = posts.findIndex((item) => item.id === id);
  if (postIndex === -1) notFound();

  const post = posts[postIndex];
  const newerPost = posts[postIndex - 1];
  const olderPost = posts[postIndex + 1];

  return (
    <div className="site-frame article-site">
      <a className="skip-link" href="#article">본문으로 바로가기</a>

      <header className="masthead">
        <Link className="site-title" href="/">이산재혁</Link>
        <nav aria-label="주요 메뉴">
          <Link href="/#categories">Categories</Link>
          <a href="https://isanjaehyuk.tistory.com/tag" target="_blank" rel="noreferrer">Tags</a>
        </nav>
      </header>

      <div className="page-grid article-grid">
        <aside className="sidebar article-sidebar">
          <div className="profile">
            <Image src="/profile.jpg" alt="억새밭에 서 있는 이산재혁" width={112} height={112} priority />
            <h2>이산재혁</h2>
            <p>배우고, 만들고, 기록합니다.</p>
            <div className="profile-links">
              <a href="https://github.com/IsanBrandon" target="_blank" rel="noreferrer">GitHub</a>
              <a href="https://isanjaehyuk.tistory.com/" target="_blank" rel="noreferrer">Tistory</a>
            </div>
          </div>

          <nav className="category-nav article-category-nav" aria-label="카테고리">
            <Link className="all-posts" href="/"><span>📂 전체 게시글</span><strong>{posts.length}</strong></Link>
            {categories.map((category) => (
              <section key={category.name}>
                <Link className="category-parent" href={categoryHref(category.name)}>
                  <span>{category.icon} {category.name}</span><strong>{category.count}</strong>
                </Link>
                <div className="category-children">
                  {category.children.map((child) => (
                    <Link href={categoryHref(`${category.name}/${child.name}`)} key={`${category.name}/${child.name}`}>
                      <span>{child.name}</span><em>{child.count}</em>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </nav>
        </aside>

        <main id="article" className="article-content">
          <Link className="back-link" href={categoryHref(post.category)}>← {post.category.replace("/", " / ")}</Link>
          <article>
            <header className="post-header">
              <p className="post-category">{post.category.replace("/", " / ")}</p>
              <h1>{post.title}</h1>
              <div className="post-byline">
                <time dateTime={post.published}>{formatPostDate(post.published)}</time>
                <span>이산재혁</span>
              </div>
            </header>

            <div className="post-body" dangerouslySetInnerHTML={{ __html: post.content }} />

            <div className="source-note">
              <span>이 글은 티스토리에서 옮겨왔습니다.</span>
              <a href={post.sourceUrl} target="_blank" rel="noreferrer">원문 보기 ↗</a>
            </div>

            <nav className="post-navigation" aria-label="이전 및 다음 글">
              {newerPost ? (
                <Link href={`/posts/${newerPost.id}/`}>
                  <small>새 글</small><span>← {newerPost.title}</span>
                </Link>
              ) : <span />}
              {olderPost ? (
                <Link href={`/posts/${olderPost.id}/`}>
                  <small>이전 글</small><span>{olderPost.title} →</span>
                </Link>
              ) : <span />}
            </nav>
          </article>
        </main>
      </div>

      <footer>
        <span>© 2026 이산재혁</span>
        <Link href="/">전체 글로 돌아가기</Link>
      </footer>
    </div>
  );
}
