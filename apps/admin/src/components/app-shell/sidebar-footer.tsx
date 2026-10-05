import {Link, useLocation, useNavigate} from "@tanstack/react-router";
import {LoaderCircle, LogOut} from "lucide-react";
import {cn} from "cnfast";
import {m} from "@/paraglide/messages";
import {useSignOutMutation} from "@/queries/use-sign-out-mutation";
import {PROFILE_ITEM} from "./nav-config";

const itemClass =
  "flex w-full items-center gap-2.5 rounded-md px-4 py-3 text-sm font-medium leading-[1.4] tracking-[0.28px] transition-colors";

/** Preferences section pinned to the bottom of the sidebar: My Profile and Logout. */
export function SidebarFooter({collapsed}: {collapsed: boolean}) {
  const {pathname} = useLocation();
  const navigate = useNavigate();
  const signOut = useSignOutMutation();
  const ProfileIcon = PROFILE_ITEM.icon;

  const handleLogout = () => {
    signOut.mutate(undefined, {onSettled: () => navigate({to: "/"})});
  };

  return (
    <div className="flex flex-col gap-1 pt-4">
      {!collapsed && <p className="px-4 py-1 text-sm leading-[1.4] tracking-[0.14px] text-grey-500">{m["nav.preferences"]()}</p>}
      <Link
        to={PROFILE_ITEM.to}
        title={collapsed ? PROFILE_ITEM.label() : undefined}
        className={cn(
          itemClass,
          pathname === PROFILE_ITEM.to ? "text-primary-700" : "text-grey-600 hover:bg-grey-100",
          collapsed && "justify-center px-0"
        )}
      >
        <ProfileIcon aria-hidden="true" className="size-5 shrink-0" />
        {!collapsed && <span className="truncate">{PROFILE_ITEM.label()}</span>}
      </Link>
      <button
        type="button"
        onClick={handleLogout}
        disabled={signOut.isPending}
        title={collapsed ? m["nav.logout"]() : undefined}
        className={cn(itemClass, "text-status-fail hover:bg-status-fail-subtle", collapsed && "justify-center px-0")}
      >
        {signOut.isPending ? (
          <LoaderCircle aria-hidden="true" className="size-5 shrink-0 animate-spin" />
        ) : (
          <LogOut aria-hidden="true" className="size-5 shrink-0" />
        )}
        {!collapsed && <span className="truncate">{m["nav.logout"]()}</span>}
      </button>
    </div>
  );
}
