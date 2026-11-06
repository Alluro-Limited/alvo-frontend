import {apiClient} from "@/services/api-client";
import type {AdminDetail, AdminsService, AdminRole, AdminRow, AdminStatus, PermissionCatalog} from "@/types/admins-types";

interface ApiAdmin {
  id: string;
  code: string;
  name: string;
  email: string;
  role: string;
  status: string;
  grants: string[];
  totpEnabled?: boolean;
  lastActiveAt?: string;
  invitedBy?: string;
  version: number;
  createdAt: string;
}

interface ApiListAdminsResponse {
  admins: ApiAdmin[];
  nextPageToken: string;
  total: string;
}

interface ApiRole {
  id: string;
  label: string;
  permissions?: string[];
}

interface ApiPermission {
  key: string;
  label?: string;
}

const STATUS: Record<string, AdminStatus> = {
  ADMIN_STATUS_ACTIVE: "active",
  ADMIN_STATUS_SUSPENDED: "suspended",
  ADMIN_STATUS_INVITED: "invited",
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

const EMPTY_CATALOG: PermissionCatalog = {modules: [], presets: {} as PermissionCatalog["presets"]};

/**
 * Admins against `v1/admin/admins/**` + `v1/admin/{roles,permissions}` for the invite
 * catalog. `suspendAdmin` takes no reason field on the wire; resend/revoke exist but the
 * interface doesn't expose them yet.
 */
export const httpAdminsService: AdminsService = {
  getAdmins: async (params) => {
    const searchParams = new URLSearchParams({pageSize: "50"});
    if (params.query) searchParams.set("query", params.query);
    if (params.status) searchParams.set("status", params.status);
    if (params.role) searchParams.set("role", params.role);
    const res = await apiClient.get("v1/admin/admins", {searchParams}).json<ApiListAdminsResponse>();
    const items = res.admins.map(toRow);
    return {
      metrics: {
        total: Number(res.total),
        active: items.filter((a) => a.status === "active").length,
        suspended: items.filter((a) => a.status === "suspended").length,
        invited: items.filter((a) => a.status === "invited").length,
      },
      admins: {items, page: params.page, pageSize: 50, total: Number(res.total)},
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
    return {
      modules: permissions.permissions.map((p) => ({
        key: p.key,
        label: p.label ?? p.key,
        subtitle: "",
        icon: "settings" as const,
        permissions: [{key: p.key, label: p.label ?? p.key}],
      })),
      presets: Object.fromEntries(roles.roles.map((r) => [r.id as AdminRole, r.permissions ?? []])) as PermissionCatalog["presets"],
    };
  },
  getAdminDetail: async (id) => {
    const res = await apiClient.get(`v1/admin/admins/${id}`).json<{admin: ApiAdmin}>();
    return toDetail(res.admin);
  },
  inviteAdmin: async (input) => {
    const res = await apiClient
      .post("v1/admin/admins", {
        json: {email: input.email, firstName: input.firstName, lastName: input.lastName, role: input.role, grants: input.permissions},
      })
      .json<{admin: ApiAdmin}>();
    return toDetail(res.admin);
  },
  updateAdmin: async (id, input) => {
    const res = await apiClient
      .put(`v1/admin/admins/${id}`, {
        json: {email: input.email, firstName: input.firstName, lastName: input.lastName, role: input.role, grants: input.permissions},
      })
      .json<{admin: ApiAdmin}>();
    return toDetail(res.admin);
  },
  suspendAdmin: async (id) => {
    await apiClient.post(`v1/admin/admins/${id}/suspend`, {json: {}});
    return {id, status: "suspended"};
  },
  reactivateAdmin: async (id) => {
    await apiClient.post(`v1/admin/admins/${id}/reactivate`, {json: {}});
    return {id, status: "active"};
  },
  deleteAdmin: async (id) => {
    await apiClient.post(`v1/admin/admins/${id}/delete`, {json: {}});
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
