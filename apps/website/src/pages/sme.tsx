import {Faq} from "@/components/landing/Faq";

import {CaseStudy} from "@/components/sme/CaseStudy";
import {FeatureTabs} from "@/components/sme/FeatureTabs";
import {SmeCta} from "@/components/sme/SmeCta";
import {SmeHero} from "@/components/sme/SmeHero";
import {Testimonials} from "@/components/sme/Testimonials";

import {smeFaqContent} from "@/content/sme";

export function SmePage() {
  return (
    <main id="main">
      <SmeHero />
      <CaseStudy />
      <Testimonials />
      <FeatureTabs />
      <Faq id="sme-faq" content={smeFaqContent} />
      <SmeCta />
    </main>
  );
}
