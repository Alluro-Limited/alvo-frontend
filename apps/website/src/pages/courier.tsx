import {CourierApp} from "@/components/courier/CourierApp";
import {CourierBenefits} from "@/components/courier/CourierBenefits";
import {CourierFinalCta} from "@/components/courier/CourierFinalCta";
import {CourierHero} from "@/components/courier/CourierHero";
import {CourierSteps} from "@/components/courier/CourierSteps";
import {Faq} from "@/components/landing/Faq";
import {Footer} from "@/components/landing/Footer";

import {courierFaqContent} from "@/content/courier";

export function CourierPage() {
  return (
    <>
      <main id="main">
        <CourierHero />
        <CourierApp />
        <CourierBenefits />
        <CourierSteps />
        <Faq content={courierFaqContent} id="requirements" />
        <CourierFinalCta />
      </main>
      <Footer />
    </>
  );
}
