import {Link} from "@tanstack/react-router";

import {BlogCardImage} from "./BlogCardImage";

import type {BlogPostSummary} from "@/lib/blog/blog";

function formatDate(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {year: "numeric", month: "long", day: "numeric"});
}

type BlogCardProps = {
  post: BlogPostSummary;
  fallbackTexture: {src: string; alt: string};
};

export function BlogCard({post, fallbackTexture}: BlogCardProps) {
  return (
    <Link to={post.href} className="block">
      <article className="flex h-[426px] flex-col overflow-clip rounded-[20px] bg-white">
        <BlogCardImage src={post.image || fallbackTexture.src} alt={post.title} />
        <div className="flex flex-1 flex-col justify-between p-6">
          <div className="flex flex-col gap-2">
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.48px] text-primary-500">{post.category}</span>
            <h3 className="font-sans text-lg font-bold leading-[1.2] text-black">{post.title}</h3>
            <p className="font-sans text-sm font-normal leading-[1.4] tracking-[0.14px] text-grey-600">{post.excerpt}</p>
          </div>
          <span className="font-sans text-[12.5px] font-normal leading-5 text-[#8a9994]">
            {post.author} · {formatDate(post.date)}
          </span>
        </div>
      </article>
    </Link>
  );
}
