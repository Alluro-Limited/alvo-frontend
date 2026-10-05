import {Link, useLocation} from "@tanstack/react-router";
import {cn} from "cnfast";
import type {ShellNavItem} from "./nav-config";

interface SidebarNavItemProps {
  item: ShellNavItem;
  collapsed: boolean;
}

/** One sidebar entry: a teal pill when its route is active, grey text otherwise. */
export function SidebarNavItem({item, collapsed}: SidebarNavItemProps) {
  const {pathname} = useLocation();
  const isActive = pathname === item.to;
  const Icon = item.icon;

  return (
    <Link
      to={item.to}
      title={collapsed ? item.label() : undefined}
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm leading-[1.4] tracking-[0.14px] transition-colors",
        isActive ? "rounded bg-primary-500 text-white" : "text-grey-600 hover:bg-grey-100",
        collapsed && "justify-center px-0"
      )}
    >
      <Icon aria-hidden="true" className="size-[18px] shrink-0" />
      {!collapsed && <span className="truncate">{item.label()}</span>}
    </Link>
  );
}
