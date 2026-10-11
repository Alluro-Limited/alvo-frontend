import {Link, useLocation} from "@tanstack/react-router";
import {cn} from "cnfast";
import {useOnboarding} from "@/components/onboarding/onboarding-context";
import type {ShellNavItem} from "./nav-config";

interface SidebarNavItemProps {
  item: ShellNavItem;
  collapsed: boolean;
}

/** One sidebar entry: a teal pill when its route is active or the tour targets it, grey otherwise. */
export function SidebarNavItem({item, collapsed}: SidebarNavItemProps) {
  const {pathname} = useLocation();
  const {tourTargetId} = useOnboarding();
  const isActive = pathname === item.to || tourTargetId === item.tourId;
  const icon = isActive ? item.iconActive : item.icon;

  return (
    <Link
      to={item.to}
      title={collapsed ? item.label() : undefined}
      data-tour={item.tourId}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-md px-4 py-3 text-sm leading-[1.4] font-medium tracking-[0.28px] transition-colors",
        isActive ? "bg-primary-500 text-white" : "text-grey-600 hover:bg-grey-100",
        collapsed && "justify-center px-0"
      )}
    >
      <img src={icon} alt="" aria-hidden="true" className="size-5 shrink-0" />
      {!collapsed && <span className="w-[178px] truncate">{item.label()}</span>}
    </Link>
  );
}
