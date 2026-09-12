import {Cta} from "@/components/Cta";
import {NavLink} from "@/components/landing/NavLink";
import {helpCtaContent} from "@/content/help";

function HelpCtaBackground() {
  const {texture, portrait, client} = helpCtaContent.background;

  return (
    <>
      <img alt={texture.alt} aria-hidden="true" className="absolute inset-0 size-full object-cover" src={texture.src} />
      <img
        alt={portrait.alt}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full object-cover"
        src={portrait.src}
      />
      <img
        alt={client.alt}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full object-cover blur-[32px]"
        src={client.src}
      />
    </>
  );
}

export function HelpCta() {
  const {heading, subhead, primary, secondary} = helpCtaContent;

  return (
    <Cta background={<HelpCtaBackground />} className="min-h-[267px]" heading={heading} id="help-cta" subhead={subhead}>
      <div className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:gap-4">
        <NavLink
          className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-primary-500 px-5 font-sans text-base font-medium tracking-[0.02em] whitespace-nowrap text-cream transition-opacity hover:opacity-90 sm:w-auto"
          href={primary.href}
        >
          {primary.label}
        </NavLink>
        <NavLink
          className="inline-flex h-12 w-full items-center justify-center rounded-lg border border-primary-500 bg-transparent px-5 font-sans text-base font-medium tracking-[0.02em] whitespace-nowrap text-primary-500 transition-colors hover:bg-primary-500/5 sm:w-auto"
          href={secondary.href}
        >
          {secondary.label}
        </NavLink>
      </div>
    </Cta>
  );
}
