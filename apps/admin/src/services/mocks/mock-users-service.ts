import {API_ERROR_CODES} from "@/lib/api-errors";
import type {UserFlag, UserListParams, UserRow, UsersService, UserSuspension} from "@/types/users-types";
import {mockDelay, mockHttpError} from "./mock-http";
import {userDetailFor, userParcelsFor} from "./mock-user-detail";
import {USER_SEEDS} from "./mock-user-seeds";

const PAGE_SIZE = 10;
const PARCELS_PAGE_SIZE = 7;
const TOTAL = 3438;

const STATUS_FILTERS = ["active", "flagged", "suspended"];
const VERIFICATION_FILTERS = ["verified", "partial", "unverified"];
const SUSPEND_REASONS = [
  "suspicious_activity",
  "payment_fraud",
  "policy_violations",
  "abusive_behavior",
  "duplicate_account",
  "other",
] as const;

/** In-memory rows — suspend/flag/delete mutations mutate this store for the session. */
const rowsStore: UserRow[] = [...USER_SEEDS];

/** Flag/suspension records seeded for every flagged/suspended row so the drawer banners render pre-mutation. */
const flagsStore = new Map<string, UserFlag>(
  USER_SEEDS.filter((row) => row.status === "flagged").map((row) => [
    row.id,
    {reason: "suspicious_activity", notes: "Unusual parcel volume flagged by the risk engine.", at: "2026-10-02T09:30:00Z"},
  ])
);
const suspensionsStore = new Map<string, UserSuspension>(
  USER_SEEDS.filter((row) => row.status === "suspended").map((row) => [
    row.id,
    {reason: "policy_violations", notes: "Repeated policy violations.", at: "2026-09-28T14:05:00Z"},
  ])
);

function applyFilters(params: Omit<UserListParams, "page">) {
  const q = params.query?.trim().toLowerCase();
  let items = rowsStore;
  if (params.status) items = items.filter((row) => row.status === params.status);
  if (params.verification) items = items.filter((row) => row.verification === params.verification);
  if (q) items = items.filter((row) => [row.id, row.name, row.email, row.phone].some((f) => f.toLowerCase().includes(q)));
  return items;
}

function metricsFor(rows: UserRow[]) {
  const count = (status: UserRow["status"]) => rows.filter((row) => row.status === status).length;
  return {
    total: TOTAL,
    verified: rows.filter((row) => row.verification === "verified").length,
    suspended: count("suspended"),
    flagged: count("flagged"),
    newToday: 489,
  };
}

function findRow(id: string, path: string) {
  const index = rowsStore.findIndex((row) => row.id === id);
  if (index < 0) throw mockHttpError(path, API_ERROR_CODES.NOT_FOUND);
  return index;
}

function toCsv(rows: UserRow[]) {
  const header = "id,name,email,phone,verification,joined_at,status";
  const body = rows.map((row) => [row.id, row.name, row.email, row.phone, row.verification, row.joinedAt, row.status].join(","));
  return [header, ...body].join("\n");
}

/** In-memory stand-in for the users API while it does not exist. */
export const mockUsersService: UsersService = {
  getUsers: async (params) => {
    await mockDelay();
    const items = applyFilters(params);
    const start = (params.page - 1) * PAGE_SIZE;
    return {
      metrics: metricsFor(rowsStore),
      users: {
        items: items.slice(start, start + PAGE_SIZE),
        page: params.page,
        pageSize: PAGE_SIZE,
        total: items.length === rowsStore.length ? TOTAL : items.length,
      },
      filters: {statuses: STATUS_FILTERS, verifications: VERIFICATION_FILTERS},
      suspendReasons: [...SUSPEND_REASONS],
    };
  },

  getUserDetail: async (id) => {
    await mockDelay();
    const index = findRow(id, `users/${id}`);
    return userDetailFor(rowsStore[index], index, {
      flag: flagsStore.get(id) ?? null,
      suspension: suspensionsStore.get(id) ?? null,
    });
  },

  getUserParcels: async (id, params) => {
    await mockDelay();
    const index = findRow(id, `users/${id}/parcels`);
    const all = userParcelsFor(rowsStore[index], 13);
    const q = params.query?.trim().toLowerCase();
    let items = all;
    if (params.status) items = items.filter((parcel) => parcel.status === params.status);
    if (q)
      items = items.filter((parcel) =>
        [parcel.id, parcel.recipient, parcel.destination, parcel.courier].some((f) => f.toLowerCase().includes(q))
      );
    const start = (params.page - 1) * PARCELS_PAGE_SIZE;
    return {items: items.slice(start, start + PARCELS_PAGE_SIZE), page: params.page, pageSize: PARCELS_PAGE_SIZE, total: items.length};
  },

  suspendUser: async (id, input) => {
    await mockDelay();
    const index = findRow(id, `users/${id}/suspend`);
    // Fresh object so refetches yield new references (in-place mutation leaves the UI stale).
    rowsStore[index] = {...rowsStore[index], status: "suspended"};
    suspensionsStore.set(id, {reason: input.reason, notes: input.notes, at: new Date().toISOString()});
    return {id, status: "suspended"};
  },

  unsuspendUser: async (id) => {
    await mockDelay();
    const index = findRow(id, `users/${id}/unsuspend`);
    rowsStore[index] = {...rowsStore[index], status: "active"};
    suspensionsStore.delete(id);
    return {id, status: "active"};
  },

  flagUsers: async (input) => {
    await mockDelay();
    for (const id of input.ids) {
      const index = findRow(id, "users/flag");
      rowsStore[index] = {...rowsStore[index], status: "flagged"};
      flagsStore.set(id, {reason: input.reason, notes: input.notes, at: new Date().toISOString()});
    }
    return {ids: input.ids, status: "flagged"};
  },

  deleteUser: async (id) => {
    await mockDelay();
    const index = findRow(id, `users/${id}`);
    rowsStore.splice(index, 1);
    flagsStore.delete(id);
    suspensionsStore.delete(id);
    return {id};
  },

  exportUsers: async (params) => {
    await mockDelay();
    const rows = params.ids?.length ? rowsStore.filter((row) => params.ids?.includes(row.id)) : applyFilters(params);
    return toCsv(rows);
  },
};
