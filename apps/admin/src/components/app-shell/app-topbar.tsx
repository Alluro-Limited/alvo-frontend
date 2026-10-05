import {Link, useLocation} from "@tanstack/react-router";
import {ChevronRight, House} from "lucide-react";
import {m} from "@/paraglide/messages";
import {navLabelForPath} from "./nav-config";
import {TopbarActions} from "./topbar-actions";
import {TopbarSearch} from "./topbar-search";

/** Figma top nav: home breadcrumb with the current page, centered search, then actions. */
export function AppTopbar() {
  const {pathname} = useLocation();
  const title = (navLabelForPath(pathname) ?? m["nav.overview"])();

  return (
    <header className="relative flex h-16 shrink-0 items-center justify-between bg-white px-6 py-3">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2">
        <Link to="/dashboard" aria-label={m["nav.home"]()} className="text-grey-600 transition-colors hover:text-grey-500">
          <House aria-hidden="true" className="size-4" />
        </Link>
        <ChevronRight aria-hidden="true" className="size-4 text-grey-400" />
        <span className="text-sm leading-[1.4] tracking-[0.14px] text-primary-800">{title}</span>
      </nav>
      <TopbarSearch />
      <TopbarActions />
    </header>
  );
}
