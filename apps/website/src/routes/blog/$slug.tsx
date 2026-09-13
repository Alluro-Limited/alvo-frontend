import {createFileRoute, notFound} from "@tanstack/react-router";

import {BlogPost} from "@/components/blog/BlogPost";
import {getBlogPostBySlug} from "@/lib/blog/blog";

export const Route = createFileRoute("/blog/$slug")({
  component: BlogPostRoute,
  loader: ({params}) => {
    const post = getBlogPostBySlug(params.slug);
    if (!post) throw notFound();
    return post;
  },
});

function BlogPostRoute() {
  const post = Route.useLoaderData();
  return <BlogPost post={post} />;
}
