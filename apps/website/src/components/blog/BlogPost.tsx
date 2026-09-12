import {Suspense} from "react";

import browserCollections from "fumadocs-mdx:collections/browser";

import type {BlogPostSummary} from "@/lib/blog/blog";

const blogClientLoader = browserCollections.blog.createClientLoader({
  component: ({default: MDX}) => <MDX />,
});

function formatDate(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {year: "numeric", month: "long", day: "numeric"});
}

type BlogPostProps = {
  post: BlogPostSummary;
};

export function BlogPost({post}: BlogPostProps) {
  const content = blogClientLoader.useContent(post.path);

  return (
    <article className="bg-white px-6 py-24 sm:px-10 lg:px-30">
      <div className="mx-auto max-w-[720px]">
        <header className="mb-12 flex flex-col gap-4 text-center">
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.48px] text-primary-500">{post.category}</span>
          <h1 className="font-sans text-[32px] font-bold leading-[1.1] tracking-[-0.32px] text-black sm:text-[42px]">{post.title}</h1>
          <p className="font-sans text-lg font-normal leading-[1.4] text-grey-600">{post.excerpt}</p>
          <span className="font-sans text-sm font-medium text-grey-600">
            {post.author} · {formatDate(post.date)}
          </span>
          {post.image ? (
            <div className="relative mt-4 h-[320px] w-full overflow-clip rounded-2xl sm:h-[420px]">
              <img alt={post.title} className="pointer-events-none absolute inset-0 size-full object-cover" src={post.image} />
            </div>
          ) : null}
        </header>
        <section className="prose prose-lg max-w-none font-sans text-grey-800">
          <Suspense fallback={<p className="text-grey-500">Loading article...</p>}>{content}</Suspense>
        </section>
      </div>
    </article>
  );
}
