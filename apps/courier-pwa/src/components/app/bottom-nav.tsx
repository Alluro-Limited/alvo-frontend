import {Link, useRouterState} from "@tanstack/react-router";
import {cn} from "cnfast";
import {ChartPie, House, Package, UserRound, type LucideIcon} from "lucide-react";
import {m} from "@/paraglide/messages";

interface NavItem {
  to: "/home" | "/deliveries" | "/earnings" | "/profile";
  label: () => string;
  icon: LucideIcon;
}

const ITEMS: NavItem[] = [
  {to: "/home", label: m["nav.home"], icon: House},
  {to: "/deliveries", label: m["nav.deliveries"], icon: Package},
  {to: "/earnings", label: m["nav.earnings"], icon: ChartPie},
  {to: "/profile", label: m["nav.profile"], icon: UserRound},
];

/** The four-tab bottom bar shared by the courier's main sections. */
export function BottomNav() {
  const pathname = useRouterState({select: (s) => s.location.pathname});

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-grey-200 bg-white pb-[env(safe-area-inset-bottom)]">
      <ul className="flex h-[70px] items-stretch">
        {ITEMS.map(({to, label, icon: Icon}) => {
          const active = pathname.startsWith(to);
          return (
            <li key={to} className="flex-1">
              <Link
                to={to}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-full flex-col items-center justify-center gap-1 text-[11px] font-medium",
                  active ? "text-primary-500" : "text-grey-400"
                )}
              >
                <Icon className="size-6" aria-hidden="true" />
                {label()}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
