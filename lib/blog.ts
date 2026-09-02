import importedPosts from "@/data/tistory-posts.json";

export type TistoryPost = {
  id: string;
  title: string;
  published: string;
  category: string;
  majorCategory: string;
  subCategory: string;
  description: string;
  content: string;
  sourceUrl: string;
  image: string;
};

export type PostSummary = Omit<TistoryPost, "content"> & {
  dateLabel: string;
  searchText: string;
};

export type CategoryNode = {
  name: string;
  count: number;
  icon: string;
  children: ReadonlyArray<{ name: string; count: number }>;
};

export const posts = importedPosts as TistoryPost[];

export const categories: ReadonlyArray<CategoryNode> = [
  {
    name: "Memoirs",
    count: 46,
    icon: "📔",
    children: [
      { name: "essay", count: 12 },
      { name: "journal", count: 6 },
      { name: "quote", count: 28 },
    ],
  },
  {
    name: "Artworks",
    count: 15,
    icon: "🎨",
    children: [
      { name: "painting", count: 14 },
      { name: "peom", count: 1 },
    ],
  },
  {
    name: "Engineering",
    count: 11,
    icon: "💻",
    children: [
      { name: "study", count: 6 },
      { name: "reseach", count: 0 },
      { name: "challenge", count: 1 },
      { name: "tech note", count: 4 },
    ],
  },
  {
    name: "Languages",
    count: 1,
    icon: "🌐",
    children: [{ name: "English", count: 1 }],
  },
  {
    name: "Finance",
    count: 4,
    icon: "💰",
    children: [
      { name: "journal", count: 1 },
      { name: "principle", count: 1 },
      { name: "references", count: 2 },
    ],
  },
] as const;

export function formatPostDate(value: string): string {
  const [date] = value.split("T");
  const [year, month, day] = date.split("-");
  return `${year}년 ${month}월 ${day}일`;
}

export function toSummary(post: TistoryPost): PostSummary {
  return {
    id: post.id,
    title: post.title,
    published: post.published,
    category: post.category,
    majorCategory: post.majorCategory,
    subCategory: post.subCategory,
    description: post.description,
    sourceUrl: post.sourceUrl,
    image: post.image,
    dateLabel: formatPostDate(post.published),
    searchText: post.content
      .replace(/<[^>]+>/g, " ")
      .replace(/&[^;]+;/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  };
}

export function categoryHref(category: string): string {
  return `/?category=${encodeURIComponent(category)}`;
}
