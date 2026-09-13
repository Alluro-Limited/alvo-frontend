import {BlogCard} from "./BlogCard";
import {BlogFeatured} from "./BlogFeatured";

import {getAllBlogPosts} from "@/lib/blog/blog";
import {blogPostsContent} from "@/content/blog";

export function BlogPostList() {
  const posts = getAllBlogPosts();
  const featured = posts.find((post) => post.featured) ?? posts[0];
  const latest = posts.filter((post) => post !== featured);

  return (
    <section className="bg-white px-6 py-24 sm:px-10 lg:px-30">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10">
        <h2 className="font-sans text-[32px] font-bold leading-[1.1] tracking-[-0.32px] text-[#0c1714]">Latest posts</h2>
        {featured ? <BlogFeatured post={featured} fallbackTexture={blogPostsContent.texture} /> : null}
        {latest.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {latest.map((post) => (
              <BlogCard key={post.slug} post={post} fallbackTexture={blogPostsContent.texture} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
