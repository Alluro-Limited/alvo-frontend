import {blog} from "fumadocs-mdx:collections/server";

export interface BlogPostSummary {
  slug: string;
  path: string;
  href: string;
  title: string;
  author: string;
  date: string;
  image: string;
  category: string;
  featured: boolean;
  excerpt: string;
}

function normalizeBlogSlug(value: string) {
  return value
    .replace(/^\/+/u, "")
    .replace(/\/index$/u, "")
    .replace(/\.(mdx|md)$/u, "");
}

function resolveSlug(normalizedPath: string) {
  const pathSegments = normalizedPath.split("/").filter(Boolean);
  return pathSegments.at(-1) ?? "";
}

export function getAllBlogPosts(): BlogPostSummary[] {
  return blog
    .map((entry) => {
      const info = entry.info as {path?: string} | undefined;
      const path = info?.path ?? "";
      const slug = resolveSlug(normalizeBlogSlug(path));

      return {
        slug,
        path,
        href: slug ? `/blog/${slug}` : "/blog",
        title: String(entry.title),
        author: String(entry.author) || "Alvo Team",
        date: String(entry.date),
        image: String(entry.image),
        category: String(entry.category) || "Product",
        featured: entry.featured === true,
        excerpt: String(entry.excerpt),
      };
    })
    .sort((left, right) => right.date.localeCompare(left.date));
}

export function getBlogPostBySlug(slug: string): BlogPostSummary | undefined {
  const normalizedSlug = normalizeBlogSlug(slug);
  return getAllBlogPosts().find((post) => post.slug === normalizedSlug);
}
