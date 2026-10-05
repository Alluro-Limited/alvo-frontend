import {
  Banknote,
  Briefcase,
  Car,
  Coins,
  LayoutGrid,
  Package,
  Route,
  Settings,
  User,
  UserCog,
  Users,
  Vault,
  type LucideIcon,
} from "lucide-react";
import {m} from "@/paraglide/messages";

export interface ShellNavItem {
  to: string;
  icon: LucideIcon;
  label: () => string;
}

interface ShellNavSection {
  label: () => string;
  items: ShellNavItem[];
}

/**
 * Sidebar sections and destinations from the Figma shell. Every entry must map to a route —
 * unfinished areas point at placeholder pages until the real screens land.
 */
export const NAV_SECTIONS: ShellNavSection[] = [
  {label: m["nav.home"], items: [{to: "/dashboard", icon: LayoutGrid, label: m["nav.overview"]}]},
  {
    label: m["nav.operations"],
    items: [
      {to: "/workloads", icon: Package, label: m["nav.workloads"]},
      {to: "/nodes", icon: Vault, label: m["nav.nodes"]},
      {to: "/assignment", icon: Route, label: m["nav.assignment"]},
    ],
  },
  {
    label: m["nav.accounts"],
    items: [
      {to: "/users", icon: Users, label: m["nav.users"]},
      {to: "/smes", icon: Briefcase, label: m["nav.smes"]},
      {to: "/couriers", icon: Car, label: m["nav.courier"]},
    ],
  },
  {
    label: m["nav.finance"],
    items: [
      {to: "/revenue", icon: Banknote, label: m["nav.revenue"]},
      {to: "/courier-payouts", icon: Coins, label: m["nav.courier_payouts"]},
    ],
  },
  {
    label: m["nav.system"],
    items: [
      {to: "/admins", icon: UserCog, label: m["nav.admins_permissions"]},
      {to: "/settings", icon: Settings, label: m["nav.settings"]},
    ],
  },
];

/** The Preferences section is styled differently (larger icons, medium weight), so it stays separate. */
export const PROFILE_ITEM: ShellNavItem = {to: "/profile", icon: User, label: m["nav.my_profile"]};

const ALL_NAV_ITEMS = [...NAV_SECTIONS.flatMap((section) => section.items), PROFILE_ITEM];

/** Resolves the breadcrumb label for the current pathname, if it belongs to the nav. */
export function navLabelForPath(pathname: string): (() => string) | undefined {
  return ALL_NAV_ITEMS.find((item) => item.to === pathname)?.label;
}
