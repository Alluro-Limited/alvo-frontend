import {FeatureSections} from "@/components/landing/FeatureSections";
import {Footer} from "@/components/landing/Footer";
import {Hero} from "@/components/landing/Hero";
import {HowItWorks} from "@/components/landing/HowItWorks";
import {Coverage} from "@/components/landing/Coverage";
import {Faq} from "@/components/landing/Faq";
import {FinalCta} from "@/components/landing/FinalCta";
import {PrivacySection} from "@/components/landing/PrivacySection";
import {Testimonials} from "@/components/landing/Testimonials";
import {TrustStats} from "@/components/landing/TrustStats";

import {faqContent} from "@/content/landing";

export function Home() {
  return (
    <>
      <main id="main">
        <Hero />
        <PrivacySection />
        <HowItWorks />
        <FeatureSections />
        <TrustStats />
        <Testimonials />
        <Coverage />
        <Faq content={faqContent} />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
