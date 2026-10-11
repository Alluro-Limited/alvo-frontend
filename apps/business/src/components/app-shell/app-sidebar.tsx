import {useState} from "react";
import {Link} from "@tanstack/react-router";
import {cn} from "cnfast";
import {m} from "@/paraglide/messages";
import navCollapseUrl from "@/assets/nav-collapse.svg";
import sidebarLogoUrl from "@/assets/sidebar-logo.svg";
import sidebarWordmarkUrl from "@/assets/sidebar-wordmark.svg";
import {HOME_NAV_ITEMS} from "./nav-config";
import {SidebarBottom} from "./sidebar-bottom";
import {SidebarNavItem} from "./sidebar-nav-item";

/** Figma sidebar: 276px white rail with grouped navigation; collapses to an icon-only rail. */
export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-screen w-[276px] shrink-0 flex-col justify-between bg-white px-4 py-6 transition-[width]",
        collapsed && "w-[76px] items-center"
      )}
    >
      <div className="flex min-h-0 w-full flex-col gap-6">
        <div className={cn("flex items-center justify-between pl-4", collapsed && "flex-col gap-4 pl-0")}>
          <Link to="/dashboard" className="flex items-center gap-[8.65px]" aria-label={m["nav.home"]()}>
            <img src={sidebarLogoUrl} alt="" className="h-6 w-[26px]" />
            {!collapsed && <img src={sidebarWordmarkUrl} alt="Alvo" className="h-[18.5px] w-[86.5px]" />}
          </Link>
          <button
            type="button"
            onClick={() => setCollapsed((value) => !value)}
            aria-label={collapsed ? m["nav.expand_sidebar"]() : m["nav.collapse_sidebar"]()}
            className={cn("text-grey-600 hover:text-foreground", collapsed && "rotate-180")}
          >
            <img src={navCollapseUrl} alt="" aria-hidden="true" className="size-6" />
          </button>
        </div>
        <nav aria-label={m["nav.home"]()} className="flex w-full flex-col gap-1">
          {!collapsed && <p className="px-4 py-1 text-sm leading-[1.4] tracking-[0.14px] text-grey-500">{m["nav.home"]()}</p>}
          <div className="flex w-full flex-col">
            {HOME_NAV_ITEMS.map((item) => (
              <SidebarNavItem key={item.to} item={item} collapsed={collapsed} />
            ))}
          </div>
        </nav>
      </div>
      <SidebarBottom collapsed={collapsed} />
    </aside>
  );
}
