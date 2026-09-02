import BlogHome from "@/components/blog-home";
import { categories, posts, toSummary } from "@/lib/blog";

export default function Home() {
  return <BlogHome posts={posts.map(toSummary)} categories={categories} />;
}
