import {Outlet} from "@tanstack/react-router";

import {Footer} from "@/components/landing/Footer";
import {Navbar} from "@/components/landing/Navbar";

export function BlogPage() {
  return (
    <>
      <Navbar />
      <main id="main" className="bg-white">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
