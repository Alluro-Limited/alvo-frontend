import {AboutCards} from "@/components/about/AboutCards";
import {AboutCta} from "@/components/about/AboutCta";
import {AboutHero} from "@/components/about/AboutHero";
import {AboutMission} from "@/components/about/AboutMission";
import {BenefitsGrid} from "@/components/BenefitsGrid";
import {Footer} from "@/components/landing/Footer";
import {Navbar} from "@/components/landing/Navbar";

import {aboutValuesContent} from "@/content/about";

export function AboutPage() {
  return (
    <>
      <Navbar />
      <main id="main">
        <AboutHero />
        <AboutMission />
        <AboutCards />
        <BenefitsGrid content={aboutValuesContent} />
        <AboutCta />
      </main>
      <Footer />
    </>
  );
}
