import type {AdminRole, AdminRow} from "@/types/admins-types";
import {PERMISSION_MODULES, ROLE_PERMISSION_PRESETS} from "./mock-admin-permissions";

const NAMES = [
  "Dayo Ogunseye",
  "Oluwadamilola Folarin",
  "Quadri Olanrewaju",
  "Adaeze Nwosu",
  "Tunde Bakare",
  "Fatima Bello",
  "Chidi Okafor",
  "Ngozi Eze",
  "Ibrahim Musa",
  "Kemi Adeyemi",
  "Seun Alabi",
  "Blessing Okoro",
];
const DOMAINS = ["alvo.ng", "zoho.com", "alvo.com"];
const ROLES: AdminRole[] = ["super_admin", "operational_admin", "finance_admin", "support_admin", "viewer"];
const STATUSES: AdminRow["status"][] = ["active", "active", "active", "invited", "suspended"];
const LAST_ACTIVE = ["2 min ago", "1 hour ago", "3 hours ago", "Yesterday", "2 days ago", "—"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function hash(value: string): number {
  let out = 0;
  for (const char of value) out = (out * 31 + char.charCodeAt(0)) % 1_000_003;
  return out;
}

function splitName(name: string) {
  const [firstName, ...rest] = name.split(" ");
  return {firstName, lastName: rest.join(" ")};
}

/** Deterministic admin rows — the current user (Dayo Ogunseye) is always row one. */
export function seededAdminRows(): AdminRow[] {
  return NAMES.map((name, index) => {
    const seed = hash(name);
    const day = String(1 + (seed % 28)).padStart(2, "0");
    return {
      id: `ADM-${String(index + 1).padStart(3, "0")}`,
      name,
      email: `${name.toLowerCase().replace(/\s+/g, "")}@${DOMAINS[index % DOMAINS.length]}`,
      role: index === 0 ? "super_admin" : ROLES[(seed + index) % ROLES.length],
      status: index === 0 ? "active" : STATUSES[(seed + index) % STATUSES.length],
      lastActive: index === 0 ? "2 min ago" : LAST_ACTIVE[(seed + index) % LAST_ACTIVE.length],
      addedAt: `${MONTHS[(seed + index) % MONTHS.length]} ${day}, 2026`,
    };
  });
}

/** The granted permission keys for a seeded row — role preset minus a couple for realism. */
export function seededPermissions(row: AdminRow): string[] {
  const preset = ROLE_PERMISSION_PRESETS[row.role];
  if (row.role === "super_admin") return preset;
  const seed = hash(row.id);
  // Keep the last permission of one module off so chips read like "6/7".
  const drop = seed % preset.length;
  return preset.filter((_, index) => index !== drop);
}

const GROUP_MODULES: {key: string; label: string; moduleKeys: string[]}[] = [
  {key: "home", label: "Home", moduleKeys: ["home"]},
  {key: "operations", label: "Operations", moduleKeys: ["workloads", "nodes", "assignment"]},
  {key: "account", label: "Account", moduleKeys: ["users", "smes", "couriers"]},
  {key: "finance", label: "Finance", moduleKeys: ["revenue", "payout"]},
  {key: "system", label: "System", moduleKeys: ["admins", "settings", "audit"]},
];

/** Module Access tiles for the drawer — granted/total computed from the admin's permission set. */
export function moduleAccessFor(permissions: string[]) {
  const granted = new Set(permissions);
  return GROUP_MODULES.map((group) => {
    const keys = PERMISSION_MODULES.filter((m) => group.moduleKeys.includes(m.key)).flatMap((m) => m.permissions.map((p) => p.key));
    return {key: group.key, label: group.label, granted: keys.filter((k) => granted.has(k)).length, total: keys.length};
  });
}

export function nameParts(row: AdminRow) {
  return splitName(row.name);
}
