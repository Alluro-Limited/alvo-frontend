import {apiClient} from "@/services/api-client";
import {fetchPage} from "@/services/paged";
import {getStepUpToken} from "@/services/step-up";
import type {AdminDetail, AdminsService, AdminRole, AdminRow, AdminStatus, PermissionCatalog} from "@/types/admins-types";
import type {AdminModuleIcon} from "@/types/admins-types";

interface ApiAdmin {
  id: string;
  code: string;
  name: string;
  email: string;
  role: string;
  status: string;
  grants?: string[];
  totpEnabled?: boolean;
  lastActiveAt?: string;
  invitedBy?: string;
  version: number;
  createdAt: string;
}

interface ApiRole {
  code: string;
  name: string;
  description?: string;
  system?: boolean;
  permissions?: string[];
}

interface ApiPermission {
  name: string;
  module: string;
  description?: string;
  highRisk?: boolean;
}

const STATUS: Record<string, AdminStatus> = {
  ADMIN_STATUS_ACTIVE: "active",
  ADMIN_STATUS_SUSPENDED: "suspended",
  ADMIN_STATUS_INVITED: "invited",
  ADMIN_STATUS_DELETED: "suspended",
};

const API_STATUS: Record<string, string> = {
  active: "ADMIN_STATUS_ACTIVE",
  suspended: "ADMIN_STATUS_SUSPENDED",
  invited: "ADMIN_STATUS_INVITED",
};

const MODULE_ICONS: Record<string, AdminModuleIcon> = {
  home: "home",
  operations: "package",
  accounts: "users",
  finance: "revenue",
  system: "settings",
};

const roleOf = (role: string): AdminRole => (role as AdminRole) || "viewer";

const toRow = (a: ApiAdmin): AdminRow => ({
  id: a.id,
  name: a.name,
  email: a.email,
  role: roleOf(a.role),
  lastActive: a.lastActiveAt ?? "",
  addedAt: a.createdAt,
  status: STATUS[a.status] ?? "invited",
});

const nameParts = (name: string) => {
  const [first = "", ...rest] = name.split(" ");
  return {firstName: first, lastName: rest.join(" ")};
};

const toDetail = (a: ApiAdmin): AdminDetail => ({
  ...toRow(a),
  ...nameParts(a.name),
  addedBy: a.invitedBy ?? "System",
  moduleAccess: [],
  roleHint: "",
  permissions: a.grants ?? [],
});

const moduleLabel = (key: string) => key.charAt(0).toUpperCase() + key.slice(1);

const stepUp = () => getStepUpToken().then((token) => ({"X-Step-Up": token}));

const EMPTY_CATALOG: PermissionCatalog = {modules: [], presets: {} as PermissionCatalog["presets"]};

/**
 * Admins against `v1/admin/admins/**` + `v1/admin/{roles,permissions}` for the invite
 * catalog. `suspendAdmin` takes no reason field on the wire; resend/revoke exist but the
 * interface doesn't expose them yet.
 */
export const httpAdminsService: AdminsService = {
  getAdmins: async (params) => {
    const filters: Record<string, string> = {page_size: "50"};
    if (params.status && API_STATUS[params.status]) filters.status = API_STATUS[params.status];
    if (params.role) filters.role = params.role;
    const key = JSON.stringify(filters);
    const res = await fetchPage<ApiAdmin>(`admins:${key}`, params.page, (pageToken) =>
      apiClient
        .get("v1/admin/admins", {searchParams: {...filters, ...(pageToken ? {page_token: pageToken} : {})}})
        .json<{admins: ApiAdmin[]; nextPageToken?: string; total?: string}>()
        .then((r) => ({items: r.admins ?? [], nextPageToken: r.nextPageToken, total: Number(r.total ?? 0)}))
    );
    const items = res.items.map(toRow);
    return {
      metrics: {
        total: res.total,
        active: items.filter((a) => a.status === "active").length,
        suspended: items.filter((a) => a.status === "suspended").length,
        invited: items.filter((a) => a.status === "invited").length,
      },
      admins: {items, page: params.page, pageSize: 50, total: res.total},
      filters: {
        statuses: ["active", "suspended", "invited"],
        roles: ["super_admin", "operational_admin", "finance_admin", "support_admin", "viewer"],
      },
      roles: [],
    };
  },
  getPermissionCatalog: async () => {
    const [roles, permissions] = await Promise.all([
      apiClient
        .get("v1/admin/roles")
        .json<{roles: ApiRole[]}>()
        .catch(() => ({roles: [] as ApiRole[]})),
      apiClient
        .get("v1/admin/permissions")
        .json<{permissions: ApiPermission[]}>()
        .catch(() => ({permissions: [] as ApiPermission[]})),
    ]);
    const modules = new Map<string, ApiPermission[]>();
    for (const p of permissions.permissions) {
      const list = modules.get(p.module) ?? [];
      list.push(p);
      modules.set(p.module, list);
    }
    return {
      modules: [...modules.entries()].map(([key, items]) => ({
        key,
        label: moduleLabel(key),
        subtitle: "",
        icon: MODULE_ICONS[key] ?? ("settings" as const),
        permissions: items.map((p) => ({key: p.name, label: p.description ?? p.name})),
      })),
      presets: Object.fromEntries(roles.roles.map((r) => [r.code as AdminRole, r.permissions ?? []])) as PermissionCatalog["presets"],
    };
  },
  getAdminDetail: async (id) => {
    const res = await apiClient.get(`v1/admin/admins/${id}`).json<ApiAdmin>();
    return toDetail(res);
  },
  inviteAdmin: async (input) => {
    const res = await apiClient
      .post("v1/admin/admins", {
        json: {email: input.email, firstName: input.firstName, lastName: input.lastName, role: input.role, grants: input.permissions},
        headers: await stepUp(),
      })
      .json<ApiAdmin>();
    return toDetail(res);
  },
  updateAdmin: async (id, input) => {
    // The wire update takes role + grants plus the optimistic-concurrency version —
    // names and emails can't change after the invite is accepted.
    const current = await apiClient.get(`v1/admin/admins/${id}`).json<ApiAdmin>();
    const res = await apiClient
      .put(`v1/admin/admins/${id}`, {
        json: {version: current.version, role: input.role, grants: input.permissions},
        headers: await stepUp(),
      })
      .json<ApiAdmin>();
    return toDetail(res);
  },
  suspendAdmin: async (id) => {
    await apiClient.post(`v1/admin/admins/${id}/suspend`, {json: {}, headers: await stepUp()});
    return {id, status: "suspended"};
  },
  reactivateAdmin: async (id) => {
    await apiClient.post(`v1/admin/admins/${id}/reactivate`, {json: {}, headers: await stepUp()});
    return {id, status: "active"};
  },
  deleteAdmin: async (id) => {
    await apiClient.post(`v1/admin/admins/${id}/delete`, {json: {}, headers: await stepUp()});
    return {id};
  },
  resendInvite: async (id) => {
    await apiClient.post(`v1/admin/admins/${id}/resend`, {json: {}});
  },
  revokeInvite: async (id) => {
    await apiClient.post(`v1/admin/admins/${id}/revoke`, {json: {}});
  },
};

export {EMPTY_CATALOG};
