import {NavDownloadLink} from "./NavDownloadLink";
import {NavLink} from "./NavLink";

import {navContent} from "@/content/landing";

export function NavMobileMenu({open, onNavigate}: {open: boolean; onNavigate: () => void}) {
  if (!open) return null;

  return (
    <div
      id="mobile-nav"
      className="mt-2 flex w-full max-w-[360px] flex-col rounded-2xl border-[0.5px] border-black/10 bg-white p-2 shadow-lg lg:hidden"
    >
      <ul className="flex flex-col">
        {navContent.links.map((link) => (
          <li key={link.href}>
            <NavLink
              href={link.href}
              onClick={onNavigate}
              className="block rounded-lg px-4 py-3 text-sm font-medium text-grey-600 transition-colors hover:bg-neutral-100 hover:text-primary-500"
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>

      <NavDownloadLink className="mt-1 h-12 rounded-lg" />
    </div>
  );
}
