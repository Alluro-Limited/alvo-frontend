import {useState} from "react";
import {cn} from "cnfast";
import {m} from "@/paraglide/messages";
import navLogoutUrl from "@/assets/nav-logout.svg";
import {PREFERENCE_NAV_ITEMS} from "./nav-config";
import {SidebarNavItem} from "./sidebar-nav-item";
import {SignOutDialog} from "./sign-out-dialog";

/** The bottom rail: Preferences group (Settings, Help & Support) then the red Logout action. */
export function SidebarBottom({collapsed}: {collapsed: boolean}) {
  const [signOutOpen, setSignOutOpen] = useState(false);

  return (
    <div className="flex w-full flex-col gap-6 border-t border-grey-300">
      <div className="flex w-full flex-col gap-1 pt-4">
        {!collapsed && <p className="px-4 py-1 text-sm leading-[1.4] tracking-[0.14px] text-grey-500">{m["nav.preferences"]()}</p>}
        <div className="flex w-full flex-col">
          {PREFERENCE_NAV_ITEMS.map((item) => (
            <SidebarNavItem key={item.to} item={item} collapsed={collapsed} />
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={() => setSignOutOpen(true)}
        title={collapsed ? m["nav.logout"]() : undefined}
        className={cn(
          "flex w-full items-center gap-2.5 rounded-md px-4 py-3 text-sm leading-[1.4] font-medium tracking-[0.28px] text-status-fail hover:bg-status-fail-subtle",
          collapsed && "justify-center px-0"
        )}
      >
        <img src={navLogoutUrl} alt="" aria-hidden="true" className="size-5 shrink-0" />
        {!collapsed && <span className="w-[178px] truncate text-left">{m["nav.logout"]()}</span>}
      </button>
      <SignOutDialog open={signOutOpen} onClose={() => setSignOutOpen(false)} />
    </div>
  );
}
