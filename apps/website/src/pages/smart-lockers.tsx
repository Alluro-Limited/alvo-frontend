import {BenefitsGrid} from "@/components/BenefitsGrid";
import {Footer} from "@/components/landing/Footer";
import {PartnershipHero} from "@/components/PartnershipHero";
import {SmartLockersAccess} from "@/components/smart-lockers/SmartLockersAccess";
import {SmartLockersCta} from "@/components/smart-lockers/SmartLockersCta";

import {smartLockersBenefitsContent, smartLockersHeroContent} from "@/content/smart-lockers";

export function SmartLockersPage() {
  return (
    <>
      <main id="main">
        <PartnershipHero content={smartLockersHeroContent} />
        <SmartLockersAccess />
        <BenefitsGrid content={smartLockersBenefitsContent} />
        <SmartLockersCta />
      </main>
      <Footer />
    </>
  );
}
