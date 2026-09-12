import {useState} from "react";

import {Link} from "@tanstack/react-router";

import {NavDownloadLink} from "./NavDownloadLink";
import {NavLink} from "./NavLink";
import {NavMobileMenu} from "./NavMobileMenu";

import {navContent} from "@/content/landing";

function NavBrand() {
  return (
    <Link
      to="/"
      aria-label={`${navContent.brand} home`}
      className="flex h-[54px] shrink-0 items-center gap-1.5 rounded-lg border-[0.5px] border-black/10 bg-white px-5 sm:px-6 lg:rounded-r-none"
    >
      <img alt="" aria-hidden="true" className="h-[18px] w-auto" src="/landing/nav/logo-mark.svg" />
      <img alt={navContent.brand} className="h-3.5 w-auto" src="/landing/nav/logo-wordmark.svg" />
    </Link>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="absolute inset-x-0 top-6 z-30 flex flex-col items-center px-4 lg:top-10">
      <nav aria-label="Primary" className="flex max-w-full items-center gap-1.5">
        <NavBrand />

        <ul className="hidden h-[54px] items-center bg-white lg:flex">
          {navContent.links.map((link) => (
            <li key={link.href}>
              <NavLink
                href={link.href}
                className="flex h-[54px] items-center px-6 text-sm text-grey-600 transition-colors hover:text-primary-500"
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <NavDownloadLink className="hidden shrink-0 rounded-lg border-[0.5px] border-black/10 sm:flex lg:rounded-l-none" />

        <button
          type="button"
          aria-label={navContent.menuLabel}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setOpen(false);
          }}
          className="flex size-[54px] shrink-0 items-center justify-center rounded-lg border-[0.5px] border-black/10 bg-white text-grey-600 transition-colors hover:bg-neutral-100 lg:hidden"
        >
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>

      <NavMobileMenu open={open} onNavigate={() => setOpen(false)} />
    </div>
  );
}
