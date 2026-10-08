import type {LucideIcon} from "lucide-react";
import {
  Banknote,
  ClipboardList,
  House,
  ListChecks,
  MapPin,
  Package,
  Settings,
  Store,
  Truck,
  UserRoundCog,
  Users,
  Wallet,
} from "lucide-react";
import {m} from "@/paraglide/messages";
import type {AdminModuleIcon, AdminRole, AdminStatus} from "@/types/admins-types";

/** Table/list role pill labels — i18n-backed. */
export const adminRoleLabel: Record<AdminRole, () => string> = {
  super_admin: m["admins.role_super_admin"],
  operational_admin: m["admins.role_operational_admin"],
  finance_admin: m["admins.role_finance_admin"],
  support_admin: m["admins.role_support_admin"],
  viewer: m["admins.role_viewer"],
};

/** Role pill colors copied from the Figma Verification instances. */
export const adminRolePillClass: Record<AdminRole, string> = {
  super_admin: "bg-primary-50 text-primary-500",
  operational_admin: "bg-status-warning-subtle text-status-warning-dark",
  finance_admin: "bg-status-success-subtle text-status-success-dark",
  support_admin: "bg-secondary-50 text-secondary-500",
  viewer: "bg-grey-100 text-grey-600",
};

/** Row status → shared StatusTag variant. */
export const adminStatusVariant: Record<AdminStatus, "success" | "fail" | "pending"> = {
  active: "success",
  suspended: "fail",
  invited: "pending",
};

export const adminStatusLabel: Record<AdminStatus, () => string> = {
  active: m["admins.status_active"],
  suspended: m["admins.status_suspended"],
  invited: m["admins.status_invited"],
};

/** Catalog icon key → Lucide glyph — matches the Figma permission-tree icons per module. */
export const moduleIcon: Record<AdminModuleIcon, LucideIcon> = {
  home: House,
  package: Package,
  nodes: MapPin,
  assignment: ClipboardList,
  users: Users,
  smes: Store,
  couriers: Truck,
  revenue: Banknote,
  payout: Wallet,
  admins: UserRoundCog,
  settings: Settings,
  audit: ListChecks,
};
