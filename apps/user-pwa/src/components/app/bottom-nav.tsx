import {Link, useRouterState} from "@tanstack/react-router";
import {cn} from "cnfast";
import {FileText, House, MessagesSquare, Settings, type LucideIcon} from "lucide-react";
import {m} from "@/paraglide/messages";

interface NavItem {
  to: "/home" | "/activities" | "/support" | "/account";
  label: () => string;
  icon: LucideIcon;
}

const ITEMS: NavItem[] = [
  {to: "/home", label: m["nav.home"], icon: House},
  {to: "/activities", label: m["nav.activities"], icon: FileText},
  {to: "/support", label: m["nav.support"], icon: MessagesSquare},
  {to: "/account", label: m["nav.account"], icon: Settings},
];

/** The four-tab bottom bar shared by the user's main sections (Home/Activities/Support/Account). */
export function BottomNav() {
  const pathname = useRouterState({select: (s) => s.location.pathname});

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-grey-200 bg-white pb-[env(safe-area-inset-bottom)]">
      <ul className="flex h-[70px] items-stretch justify-center gap-10">
        {ITEMS.map(({to, label, icon: Icon}) => {
          const active = pathname.startsWith(to);
          return (
            <li key={to}>
              <Link
                to={to}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-full flex-col items-center justify-center gap-1 text-[12px]",
                  active ? "font-medium text-primary-500" : "text-grey-500"
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
