import {API_ERROR_CODES} from "@/lib/api-errors";
import type {AdminDetail, AdminListParams, AdminListResponse, AdminsService, AdminStatus, InviteAdminInput} from "@/types/admins-types";
import {PERMISSION_MODULES, ROLE_OPTIONS, ROLE_PERMISSION_PRESETS} from "./mock-admin-permissions";
import {moduleAccessFor, nameParts, seededAdminRows, seededPermissions} from "./mock-admin-seeds";
import {mockDelay, mockHttpError} from "./mock-http";

const PAGE_SIZE = 10;
const STATUS_FILTERS: AdminStatus[] = ["active", "suspended", "invited"];

/** Permission grants keyed by admin id — mutations update them so edits persist. */
const permissionStore = new Map<string, string[]>();
let rowStore: AdminListResponse["admins"]["items"] | null = null;
let adminSeq = 100;

type StoreRow = AdminListResponse["admins"]["items"][number];

function rowsFor(): StoreRow[] {
  if (!rowStore) rowStore = seededAdminRows();
  return rowStore;
}

function permissionsFor(row: StoreRow): string[] {
  let perms = permissionStore.get(row.id);
  if (!perms) {
    perms = seededPermissions(row);
    permissionStore.set(row.id, perms);
  }
  return perms;
}

function findRow(id: string, path: string) {
  const rows = rowsFor();
  const index = rows.findIndex((row) => row.id === id);
  if (index < 0) throw mockHttpError(path, API_ERROR_CODES.NOT_FOUND);
  return {rows, index};
}

function applyFilters(rows: StoreRow[], params: AdminListParams) {
  const q = params.query?.trim().toLowerCase();
  let items = rows;
  if (params.status) items = items.filter((row) => row.status === params.status);
  if (params.role) items = items.filter((row) => row.role === params.role);
  if (q) items = items.filter((row) => [row.id, row.name, row.email].some((f) => f.toLowerCase().includes(q)));
  return items;
}

function detailFor(row: StoreRow): AdminDetail {
  const permissions = permissionsFor(row);
  const parts = nameParts(row);
  return {
    ...row,
    ...parts,
    addedBy: row.id === "ADM-001" ? "System" : "Dayo Ogunseye",
    moduleAccess: moduleAccessFor(permissions),
    roleHint: ROLE_OPTIONS.find((option) => option.id === row.role)?.hint ?? "",
    permissions,
  };
}

/** In-memory stand-in for the admin management API while it does not exist. */
export const mockAdminsService: AdminsService = {
  getAdmins: async (params) => {
    await mockDelay();
    const rows = rowsFor();
    const items = applyFilters(rows, params);
    const start = (params.page - 1) * PAGE_SIZE;
    return {
      metrics: {
        total: rows.length,
        active: rows.filter((row) => row.status === "active").length,
        suspended: rows.filter((row) => row.status === "suspended").length,
        invited: rows.filter((row) => row.status === "invited").length,
      },
      admins: {items: items.slice(start, start + PAGE_SIZE), page: params.page, pageSize: PAGE_SIZE, total: items.length},
      filters: {statuses: STATUS_FILTERS, roles: ROLE_OPTIONS.map((option) => option.id)},
      roles: ROLE_OPTIONS,
    };
  },

  getPermissionCatalog: async () => {
    await mockDelay();
    return {modules: PERMISSION_MODULES, presets: ROLE_PERMISSION_PRESETS};
  },

  getAdminDetail: async (id) => {
    await mockDelay();
    const {rows, index} = findRow(id, `admins/${id}`);
    return detailFor(rows[index]);
  },

  inviteAdmin: async (input) => {
    await mockDelay();
    const rows = rowsFor();
    const row: StoreRow = {
      id: `ADM-${String(adminSeq++).padStart(3, "0")}`,
      name: `${input.firstName} ${input.lastName}`.trim(),
      email: input.email,
      role: input.role,
      status: "invited",
      lastActive: "—",
      addedAt: new Date().toISOString().slice(0, 10),
    };
    rows.unshift(row);
    permissionStore.set(row.id, [...input.permissions]);
    return detailFor(row);
  },

  updateAdmin: async (id, input: InviteAdminInput) => {
    await mockDelay();
    const {rows, index} = findRow(id, `admins/${id}`);
    rows[index] = {
      ...rows[index],
      name: `${input.firstName} ${input.lastName}`.trim(),
      email: input.email,
      role: input.role,
    };
    permissionStore.set(id, [...input.permissions]);
    return detailFor(rows[index]);
  },

  suspendAdmin: async (id) => {
    await mockDelay();
    const {rows, index} = findRow(id, `admins/${id}/suspend`);
    rows[index] = {...rows[index], status: "suspended"};
    return {id, status: "suspended"};
  },

  reactivateAdmin: async (id) => {
    await mockDelay();
    const {rows, index} = findRow(id, `admins/${id}/reactivate`);
    rows[index] = {...rows[index], status: "active"};
    return {id, status: "active"};
  },

  deleteAdmin: async (id) => {
    await mockDelay();
    const {rows, index} = findRow(id, `admins/${id}`);
    rows.splice(index, 1);
    permissionStore.delete(id);
    return {id};
  },
};
