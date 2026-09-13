import {Footer} from "@/components/landing/Footer";
import {Navbar} from "@/components/landing/Navbar";
import {HelpCta} from "@/components/help/HelpCta";
import {HelpFaq} from "@/components/help/HelpFaq";
import {HelpHero} from "@/components/help/HelpHero";
import {HelpTopics} from "@/components/help/HelpTopics";

export function HelpPage() {
  return (
    <>
      <Navbar />
      <main id="main" className="bg-white">
        <HelpHero />
        <HelpTopics />
        <HelpFaq />
        <HelpCta />
      </main>
      <Footer />
    </>
  );
}
