import {API_ERROR_CODES} from "@/lib/api-errors";
import type {SmeFlag, SmeListParams, SmeRow, SmesService, SmeSuspension, SmeVerificationItem} from "@/types/smes-types";
import {mockDelay, mockHttpError} from "./mock-http";
import {smeDetailFor, verificationFor, verificationItemsFor} from "./mock-sme-detail";
import {SME_SEEDS} from "./mock-sme-seeds";

const PAGE_SIZE = 10;
const TOTAL = 343;

const STATUS_FILTERS = ["active", "flagged", "suspended"];
const VERIFICATION_FILTERS = ["verified", "partial", "unverified"];
const SUSPEND_REASONS = [
  "fraudulent_bulk_uploads",
  "payment_default",
  "fake_documents",
  "policy_violations",
  "abusive_behavior",
  "other",
] as const;
const DEACTIVATE_REASONS = ["customer_decision", "business_closed", "compliance_hold", "duplicate_account", "other"] as const;
const BUSINESS_TYPES = [
  "E-commerce",
  "Gadget Retail",
  "Fashion & Beauty",
  "Healthcare",
  "Manufacturing",
  "Technology",
  "Financial Service",
  "Clothing Textile",
];

/** In-memory rows — mutations replace rows with fresh objects so refetches render correctly. */
const rowsStore: SmeRow[] = [...SME_SEEDS];

/** Editable business/contact fields live beside the list row. */
const detailStore = new Map<
  string,
  {
    businessName: string;
    businessType: string;
    businessPhone: string;
    businessEmail: string;
    location: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
  }
>();

/** Flag/suspension records seeded for every flagged/suspended row so the drawer banners render pre-mutation. */
const flagsStore = new Map<string, SmeFlag>(
  SME_SEEDS.filter((row) => row.status === "flagged").map((row) => [
    row.id,
    {reason: "suspicious_activity", notes: "Bulk upload pattern flagged by the risk engine.", at: "2026-10-02T09:30:00Z"},
  ])
);
const suspensionsStore = new Map<string, SmeSuspension>(
  SME_SEEDS.filter((row) => row.status === "suspended").map((row) => [
    row.id,
    {reason: "fraudulent_bulk_uploads", notes: "Repeated fraudulent bulk uploads.", at: "2026-09-28T14:05:00Z"},
  ])
);

/** Per-item verification status — approvals update this store. */
const verificationItemsStore = new Map<string, SmeVerificationItem[]>();

function itemsFor(row: SmeRow) {
  if (!verificationItemsStore.has(row.id)) verificationItemsStore.set(row.id, verificationItemsFor(row));
  return verificationItemsStore.get(row.id) ?? [];
}

function applyFilters(params: Omit<SmeListParams, "page">) {
  const q = params.query?.trim().toLowerCase();
  let items = rowsStore;
  if (params.status) items = items.filter((row) => row.status === params.status);
  if (params.verification) items = items.filter((row) => row.verification === params.verification);
  if (q) items = items.filter((row) => [row.id, row.businessName, row.industry, row.location].some((f) => f.toLowerCase().includes(q)));
  return items;
}

function metricsFor(rows: SmeRow[]) {
  const count = (status: SmeRow["status"]) => rows.filter((row) => row.status === status).length;
  return {
    total: TOTAL,
    verified: rows.filter((row) => row.verification === "verified").length,
    suspended: count("suspended"),
    flagged: count("flagged"),
    newToday: 21,
  };
}

function findRow(id: string, path: string) {
  const index = rowsStore.findIndex((row) => row.id === id);
  if (index < 0) throw mockHttpError(path, API_ERROR_CODES.NOT_FOUND);
  return index;
}

function detailFor(index: number) {
  const row = rowsStore[index];
  const overrides = detailStore.get(row.id);
  const detail = smeDetailFor({...row, ...(overrides ? {businessName: overrides.businessName, location: overrides.location} : {})}, index, {
    flag: flagsStore.get(row.id) ?? null,
    suspension: suspensionsStore.get(row.id) ?? null,
    now: new Date(),
  });
  return {...detail, ...(overrides ?? {}), verificationItems: itemsFor(row)};
}

/** Edits to name/type/location are also visible on the list row. */
function applyRowUpdate(index: number, input: {businessName?: string; businessType?: string; location?: string}) {
  if (!input.businessName && !input.businessType && !input.location) return;
  const row = rowsStore[index];
  rowsStore[index] = {
    ...row,
    businessName: input.businessName ?? row.businessName,
    industry: input.businessType ?? row.industry,
    location: input.location ?? row.location,
  };
}

function toCsv(rows: SmeRow[]) {
  const header = "id,business_name,industry,location,verification,joined_at,status";
  const body = rows.map((row) =>
    [row.id, row.businessName, row.industry, row.location, row.verification, row.joinedAt, row.status].join(",")
  );
  return [header, ...body].join("\n");
}

/** In-memory stand-in for the SMEs API while it does not exist. */
export const mockSmesService: SmesService = {
  getSmes: async (params) => {
    await mockDelay();
    const items = applyFilters(params);
    const start = (params.page - 1) * PAGE_SIZE;
    return {
      metrics: metricsFor(rowsStore),
      smes: {
        items: items.slice(start, start + PAGE_SIZE),
        page: params.page,
        pageSize: PAGE_SIZE,
        total: items.length === rowsStore.length ? TOTAL : items.length,
      },
      filters: {statuses: STATUS_FILTERS, verifications: VERIFICATION_FILTERS},
      suspendReasons: [...SUSPEND_REASONS],
      deactivateReasons: [...DEACTIVATE_REASONS],
      businessTypes: [...BUSINESS_TYPES],
    };
  },

  getSmeDetail: async (id) => {
    await mockDelay();
    return detailFor(findRow(id, `smes/${id}`));
  },

  updateSme: async (id, input) => {
    await mockDelay();
    const index = findRow(id, `smes/${id}`);
    const current = detailStore.get(id) ?? detailFor(index);
    detailStore.set(id, {
      businessName: input.businessName ?? current.businessName,
      businessType: input.businessType ?? current.businessType,
      businessPhone: input.businessPhone ?? current.businessPhone,
      businessEmail: input.businessEmail ?? current.businessEmail,
      location: input.location ?? current.location,
      contactName: input.contactName ?? current.contactName,
      contactEmail: input.contactEmail ?? current.contactEmail,
      contactPhone: input.contactPhone ?? current.contactPhone,
    });
    applyRowUpdate(index, input);
    return detailFor(index);
  },

  approveVerificationItem: async (id, itemKey) => {
    await mockDelay();
    const index = findRow(id, `smes/${id}/verification/${itemKey}/approve`);
    const row = rowsStore[index];
    const items = itemsFor(row).map((item) => (item.key === itemKey ? {...item, status: "approved" as const} : item));
    if (!items.some((item) => item.key === itemKey)) throw mockHttpError(`smes/${id}/verification`, API_ERROR_CODES.NOT_FOUND);
    verificationItemsStore.set(id, items);
    // The row's verification pill tracks the item pipeline.
    const verification = verificationFor(items);
    if (verification !== row.verification) rowsStore[index] = {...row, verification};
    return detailFor(index);
  },

  suspendSme: async (id, input) => {
    await mockDelay();
    const index = findRow(id, `smes/${id}/suspend`);
    rowsStore[index] = {...rowsStore[index], status: "suspended"};
    suspensionsStore.set(id, {reason: input.reason, notes: input.notes, at: new Date().toISOString()});
    return {id, status: "suspended"};
  },

  unsuspendSme: async (id) => {
    await mockDelay();
    const index = findRow(id, `smes/${id}/unsuspend`);
    rowsStore[index] = {...rowsStore[index], status: "active"};
    suspensionsStore.delete(id);
    return {id, status: "active"};
  },

  flagSmes: async (input) => {
    await mockDelay();
    for (const id of input.ids) {
      const index = findRow(id, "smes/flag");
      rowsStore[index] = {...rowsStore[index], status: "flagged"};
      flagsStore.set(id, {reason: input.reason, notes: input.notes, at: new Date().toISOString()});
    }
    return {ids: input.ids, status: "flagged"};
  },

  deactivateSme: async (id) => {
    await mockDelay();
    const index = findRow(id, `smes/${id}/deactivate`);
    rowsStore.splice(index, 1);
    flagsStore.delete(id);
    suspensionsStore.delete(id);
    verificationItemsStore.delete(id);
    detailStore.delete(id);
    return {id};
  },

  exportSmes: async (params) => {
    await mockDelay();
    const rows = params.ids?.length ? rowsStore.filter((row) => params.ids?.includes(row.id)) : applyFilters(params);
    return toCsv(rows);
  },
};
