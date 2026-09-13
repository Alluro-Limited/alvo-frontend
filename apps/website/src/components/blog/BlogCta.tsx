import {Cta} from "@/components/Cta";
import {blogPostsContent} from "@/content/blog";

function BlogCtaBackground() {
  const {texture, client} = blogPostsContent.cta.background;

  return (
    <>
      <img alt={texture.alt} aria-hidden="true" className="absolute inset-0 size-full object-cover" src={texture.src} />
      <img alt={client.alt} className="pointer-events-none absolute inset-0 size-full object-cover blur-[32px]" src={client.src} />
    </>
  );
}

export function BlogCta() {
  const {heading, subhead, primary, secondary} = blogPostsContent.cta;

  return (
    <Cta id="blog-cta" background={<BlogCtaBackground />} className="min-h-[267px]" heading={heading} subhead={subhead}>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <a
          href={primary.href}
          className="inline-flex h-12 items-center justify-center rounded-lg bg-primary-500 px-5 font-sans text-base font-medium tracking-[0.02em] text-cream"
        >
          {primary.label}
        </a>
        <a
          href={secondary.href}
          className="inline-flex h-12 items-center justify-center rounded-lg border border-primary-500 px-5 font-sans text-base font-medium tracking-[0.02em] text-primary-500"
        >
          {secondary.label}
        </a>
      </div>
    </Cta>
  );
}
