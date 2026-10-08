import * as v from "valibot";
import {apiClient} from "@/services/api-client";
import type {AdminsService, PermissionCatalog} from "@/types/admins-types";

const StatusSchema = v.picklist(["active", "suspended", "invited"]);
const RoleSchema = v.picklist(["super_admin", "operational_admin", "finance_admin", "support_admin", "viewer"]);
const IconSchema = v.picklist([
  "home",
  "package",
  "nodes",
  "assignment",
  "users",
  "smes",
  "couriers",
  "revenue",
  "payout",
  "admins",
  "settings",
  "audit",
]);

const PageSchema = <T extends v.GenericSchema>(item: T) =>
  v.object({items: v.array(item), page: v.number(), pageSize: v.number(), total: v.number()});

const RowSchema = v.object({
  id: v.string(),
  name: v.string(),
  email: v.string(),
  role: RoleSchema,
  lastActive: v.string(),
  addedAt: v.string(),
  status: StatusSchema,
});

const RoleOptionSchema = v.object({id: RoleSchema, label: v.string(), hint: v.string()});

const ModuleSchema = v.object({
  key: v.string(),
  label: v.string(),
  subtitle: v.string(),
  icon: IconSchema,
  permissions: v.array(v.object({key: v.string(), label: v.string()})),
});

const DetailSchema = v.object({
  ...RowSchema.entries,
  firstName: v.string(),
  lastName: v.string(),
  addedBy: v.string(),
  moduleAccess: v.array(v.object({key: v.string(), label: v.string(), granted: v.number(), total: v.number()})),
  roleHint: v.string(),
  permissions: v.array(v.string()),
});

const ListSchema = v.object({
  metrics: v.object({total: v.number(), active: v.number(), suspended: v.number(), invited: v.number()}),
  admins: PageSchema(RowSchema),
  filters: v.object({statuses: v.array(StatusSchema), roles: v.array(RoleSchema)}),
  roles: v.array(RoleOptionSchema),
});

const StatusResultSchema = v.object({id: v.string(), status: StatusSchema});

/** Ky adapter for the admin management API — active when `VITE_API_URL` is set. */
export const httpAdminsService: AdminsService = {
  getAdmins: async (params) => {
    const body = await apiClient
      .get("admins", {searchParams: {query: params.query ?? "", status: params.status ?? "", role: params.role ?? "", page: params.page}})
      .json();
    return v.parse(ListSchema, body);
  },

  getPermissionCatalog: async () =>
    v.parse(
      v.object({modules: v.array(ModuleSchema), presets: v.record(RoleSchema, v.array(v.string()))}),
      await apiClient.get("admins/permission-catalog").json()
    ) as PermissionCatalog,

  getAdminDetail: async (id) => v.parse(DetailSchema, await apiClient.get(`admins/${id}`).json()),

  inviteAdmin: async (input) => v.parse(DetailSchema, await apiClient.post("admins/invite", {json: input}).json()),

  updateAdmin: async (id, input) => v.parse(DetailSchema, await apiClient.put(`admins/${id}`, {json: input}).json()),

  suspendAdmin: async (id) => v.parse(StatusResultSchema, await apiClient.post(`admins/${id}/suspend`).json()),

  reactivateAdmin: async (id) => v.parse(StatusResultSchema, await apiClient.post(`admins/${id}/reactivate`).json()),

  deleteAdmin: async (id) => v.parse(v.object({id: v.string()}), await apiClient.delete(`admins/${id}`).json()),
};
