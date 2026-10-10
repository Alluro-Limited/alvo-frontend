import type {Page} from "./workloads-types";

/** Account lifecycle states the admins table and pills render. */
export type AdminStatus = "active" | "suspended" | "invited";

/** Backend role identifiers — labels and hints are supplied by the service. */
export type AdminRole = "super_admin" | "operational_admin" | "finance_admin" | "support_admin" | "viewer";

/** The four metric cards above the admin list. */
export interface AdminMetrics {
  total: number;
  active: number;
  suspended: number;
  invited: number;
}

/** One row in the admins table. */
export interface AdminRow {
  /** System identifier, e.g. "ADM-001". */
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  /** Display string, e.g. "2 mins ago". */
  lastActive: string;
  /** Display date, e.g. "Apr 15, 2026". */
  addedAt: string;
  status: AdminStatus;
}

export interface AdminListParams {
  query?: string;
  status?: string;
  role?: string;
  page: number;
}

/** One role option in the invite/edit select — the hint renders in the blue info box. */
export interface RoleOption {
  id: AdminRole;
  label: string;
  hint: string;
}

export interface AdminListResponse {
  metrics: AdminMetrics;
  admins: Page<AdminRow>;
  filters: {statuses: AdminStatus[]; roles: AdminRole[]};
  /** Role options for the invite/edit selects — backend-supplied. */
  roles: RoleOption[];
}

/** One toggleable action inside a permission module. */
export interface AdminPermission {
  key: string;
  label: string;
}

/** One module in the "Platform Access & Permissions" tree. */
export interface PermissionModule {
  key: string;
  label: string;
  subtitle: string;
  /** Key resolved client-side to a Lucide icon — services don't ship components. */
  icon: AdminModuleIcon;
  permissions: AdminPermission[];
}

/** Icon identifiers used by the permission catalog — mapped to Lucide icons in the UI. */
export type AdminModuleIcon =
  | "home"
  | "package"
  | "nodes"
  | "assignment"
  | "users"
  | "smes"
  | "couriers"
  | "revenue"
  | "payout"
  | "admins"
  | "settings"
  | "audit";

/** The invite/edit permission payload — module catalog plus the default grants applied per role. */
export interface PermissionCatalog {
  modules: PermissionModule[];
  /** Permission keys pre-selected when a role is picked — the UI still lets you override each toggle. */
  presets: Record<AdminRole, string[]>;
}

/** One module-group tile in the drawer's Module Access card, e.g. "Finance 6/7". */
export interface ModuleAccessGroup {
  key: string;
  label: string;
  granted: number;
  total: number;
}

/** Detail payload behind the admin drawer. */
export interface AdminDetail extends AdminRow {
  firstName: string;
  lastName: string;
  /** Display string for the inviter, e.g. "System" or an admin name. */
  addedBy: string;
  /** The five module-group tiles shown in the Module Access card. */
  moduleAccess: ModuleAccessGroup[];
  /** Blue info-box text describing the admin's role. */
  roleHint: string;
  /** Granted permission keys across all modules. */
  permissions: string[];
}

export interface InviteAdminInput {
  firstName: string;
  lastName: string;
  email: string;
  role: AdminRole;
  permissions: string[];
}

export interface UpdateAdminInput extends InviteAdminInput {}

export interface AdminsService {
  getAdmins: (params: AdminListParams) => Promise<AdminListResponse>;
  /** The module/permission catalog rendered by the invite drawer and edit dialog. */
  getPermissionCatalog: () => Promise<PermissionCatalog>;
  getAdminDetail: (id: string) => Promise<AdminDetail>;
  inviteAdmin: (input: InviteAdminInput) => Promise<AdminDetail>;
  updateAdmin: (id: string, input: UpdateAdminInput) => Promise<AdminDetail>;
  suspendAdmin: (id: string) => Promise<{id: string; status: AdminStatus}>;
  reactivateAdmin: (id: string) => Promise<{id: string; status: AdminStatus}>;
  deleteAdmin: (id: string) => Promise<{id: string}>;
}
