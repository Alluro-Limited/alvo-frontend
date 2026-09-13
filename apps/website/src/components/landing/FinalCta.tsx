import {AppCtas} from "./AppCtas";

import {Cta} from "@/components/Cta";
import {finalCtaContent} from "@/content/landing";

export function FinalCta() {
  return (
    <Cta
      id="final-cta"
      heading={finalCtaContent.heading}
      subhead={finalCtaContent.subhead}
      background={
        <img
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 size-full object-cover mix-blend-overlay"
          src={finalCtaContent.texture.src}
        />
      }
      className="min-h-[440px] bg-primary-500 sm:min-h-[540px] lg:h-[669px]"
    >
      <AppCtas tone="onLight" />
    </Cta>
  );
}
