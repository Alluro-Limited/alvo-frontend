import {BenefitsGrid} from "@/components/BenefitsGrid";
import {BlogCta} from "@/components/blog/BlogCta";
import {BlogHero} from "@/components/blog/BlogHero";
import {BlogPostList} from "@/components/blog/BlogPostList";
import {BlogStatement} from "@/components/blog/BlogStatement";
import {blogPostsContent} from "@/content/blog";

export function BlogIndex() {
  return (
    <>
      <BlogHero />
      <BlogPostList />
      <BlogStatement />
      <BenefitsGrid content={blogPostsContent.values} />
      <BlogCta />
    </>
  );
}
