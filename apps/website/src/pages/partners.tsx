import {BenefitsGrid} from "@/components/BenefitsGrid";
import {Footer} from "@/components/landing/Footer";
import {PartnershipHero} from "@/components/PartnershipHero";
import {PartnersCta} from "@/components/partners/PartnersCta";
import {PartnersForm} from "@/components/partners/PartnersForm";
import {PartnersWays} from "@/components/partners/PartnersWays";

import {partnersHeroContent, partnersWhyHostContent} from "@/content/partners";

export function PartnersPage() {
  return (
    <>
      <main id="main">
        <PartnershipHero content={partnersHeroContent} />
        <PartnersWays />
        <BenefitsGrid content={partnersWhyHostContent} />
        <PartnersForm />
        <PartnersCta />
      </main>
      <Footer />
    </>
  );
}
