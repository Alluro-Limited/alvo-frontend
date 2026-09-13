import {Link} from "@tanstack/react-router";

import {BlogCardImage} from "./BlogCardImage";

import type {BlogPostSummary} from "@/lib/blog/blog";

function formatDate(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {year: "numeric", month: "long", day: "numeric"});
}

type BlogFeaturedProps = {
  post: BlogPostSummary;
  fallbackTexture: {src: string; alt: string};
};

export function BlogFeatured({post, fallbackTexture}: BlogFeaturedProps) {
  return (
    <Link to={post.href} className="block">
      <article className="flex flex-col overflow-clip rounded-[28px] bg-white lg:flex-row">
        <div className="relative h-[226px] w-full lg:h-auto lg:flex-1">
          <BlogCardImage src={post.image || fallbackTexture.src} alt={post.title} />
        </div>
        <div className="flex flex-1 flex-col justify-between gap-6 p-8 sm:p-10">
          <div className="flex flex-col gap-4">
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.48px] text-primary-500">{post.category}</span>
            <h3 className="font-sans text-[28px] font-bold leading-[1.1] tracking-[-0.32px] text-black sm:text-[32px]">{post.title}</h3>
            <p className="max-w-3xl font-sans text-lg font-normal leading-[1.4] tracking-[0.18px] text-grey-600">{post.excerpt}</p>
          </div>
          <span className="font-sans text-[13px] font-normal leading-[1.6] text-grey-600">
            {post.author} · {formatDate(post.date)}
          </span>
        </div>
      </article>
    </Link>
  );
}
