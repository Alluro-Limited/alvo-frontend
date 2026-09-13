import {ContactCards} from "@/components/contact/ContactCards";
import {ContactForm} from "@/components/contact/ContactForm";
import {ContactHero} from "@/components/contact/ContactHero";
import {ContactOffice} from "@/components/contact/ContactOffice";
import {Footer} from "@/components/landing/Footer";
import {Navbar} from "@/components/landing/Navbar";

export function ContactPage() {
  return (
    <>
      <Navbar />
      <main id="main" className="bg-white">
        <ContactHero />
        <ContactCards />
        <ContactForm />
        <ContactOffice />
      </main>
      <Footer />
    </>
  );
}
