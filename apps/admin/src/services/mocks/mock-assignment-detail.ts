import type {
  AssignmentDetail,
  AssignmentItem,
  AssignmentItemStatus,
  AssignmentRow,
  AssignmentTimelineStep,
  DeliveryType,
} from "@/types/assignment-types";

const MIN_MS = 60_000;

function isoMinutesAgo(minutes: number): string {
  return new Date(Date.now() - minutes * MIN_MS).toISOString();
}

/** Bulk vs node/express item-status sequences — the chips differ per delivery type in Figma. */
const ITEM_ORDER: Record<DeliveryType, AssignmentItemStatus[]> = {
  bulk: ["waiting", "picked_up", "en_route", "at_super_node"],
  node: ["at_super_node", "picked_up", "en_route", "delivered"],
  express: ["at_super_node", "picked_up", "en_route", "delivered"],
};

const ITEM_WEIGHTS: Record<DeliveryType, AssignmentItemStatus[]> = {
  bulk: ["picked_up", "picked_up", "en_route", "waiting", "en_route", "picked_up", "en_route", "at_super_node"],
  node: ["at_super_node", "at_super_node", "en_route", "at_super_node", "picked_up"],
  express: ["delivered", "en_route", "picked_up", "delivered", "en_route"],
};

function itemFor(index: number, type: DeliveryType): AssignmentItem {
  const statuses = ITEM_WEIGHTS[type];
  return {
    id: `PRV-${87000 + index * 3}`,
    slot: `Drop slot ${String.fromCharCode(65 + (index % 6))}${1 + (index % 9)}`,
    weightKg: Math.round((0.4 + ((index * 13) % 45) / 10) * 10) / 10,
    status: statuses[index % statuses.length],
  };
}

function nodeLegs(): AssignmentTimelineStep[] {
  return [
    {label: "Assignment created", at: isoMinutesAgo(34), done: true},
    {label: "Courier notified", at: isoMinutesAgo(33), done: true},
    {label: "Picked from Super Node", at: isoMinutesAgo(21), detail: "100% loaded", done: true},
    {label: "En route to node", at: isoMinutesAgo(12), detail: "In progress", done: true},
    {label: "All parcels dropped at node", at: null, done: false},
  ];
}

function timelineFor(row: AssignmentRow): AssignmentTimelineStep[] {
  if (row.type === "node") return nodeLegs();
  const legs: AssignmentTimelineStep[] =
    row.type === "express"
      ? [
          {label: "Assignment created", at: isoMinutesAgo(34), done: true},
          {label: "Courier notified", at: isoMinutesAgo(33), done: true},
          {label: "Parcel picked up", at: isoMinutesAgo(20), detail: "Collected", done: true},
          {label: "Pickup in progress", at: isoMinutesAgo(9), detail: "Collected", done: true},
          {label: "Dropped at recipient compartment", at: null, done: false},
        ]
      : [
          {label: "Assignment created", at: isoMinutesAgo(34), done: true},
          {label: "Courier notified", at: isoMinutesAgo(33), done: true},
          {label: "Courier accepted", at: isoMinutesAgo(31), done: true},
          {label: "Pickup in progress", at: null, detail: "65% picked up", done: true},
          {label: "Dropped at Super Node", at: null, done: false},
        ];
  if (row.status === "completed") return legs.map((leg) => ({...leg, at: leg.at ?? isoMinutesAgo(5), done: true}));
  if (row.status === "created") return legs.map((leg, index) => ({...leg, at: index === 0 ? leg.at : null, done: index === 0}));
  if (row.status === "pending_pickup" || row.status === "public_pool" || row.status === "failed")
    return legs.map((leg, index) => ({...leg, at: index <= 1 ? leg.at : null, done: index <= 1}));
  return legs;
}

function areaName(place: string): string {
  return place.split("·")[1]?.trim() ?? place;
}

function codeName(place: string): string {
  return place.split("·")[0]?.trim() ?? place;
}

function courierBlock(row: AssignmentRow): Pick<AssignmentDetail, "courier" | "progress" | "etaMin"> {
  if (row.courier === null) return {courier: null, progress: null, etaMin: null};
  const courier = {name: row.courier, code: `PRG-${(20 + row.id.length * 7) % 90}`};
  if (row.status === "active") return {courier, progress: 65, etaMin: 35};
  if (row.status === "completed") return {courier, progress: 100, etaMin: null};
  return {courier, progress: null, etaMin: null};
}

/** Derives the drawer payload from a list row — the real backend would return this as one document. */
export function assignmentDetailFor(row: AssignmentRow): AssignmentDetail {
  return {
    id: row.id,
    type: row.type,
    status: row.status,
    pickup: row.pickup,
    dropoff: row.dropoff,
    items: row.items,
    ...courierBlock(row),
    declinedBy: row.status === "public_pool" ? ["ADK-09", "ADK-12"] : null,
    flag:
      row.status === "flagged"
        ? {reason: "suspicious_activity", notes: "User reports that item package seal is broken", at: isoMinutesAgo(4)}
        : null,
    timeline: timelineFor(row),
    route: `${areaName(row.pickup)} (${codeName(row.pickup)}) → ${areaName(row.dropoff)} (${codeName(row.dropoff)})`,
    itemStatusOrder: ITEM_ORDER[row.type],
    assignmentItems: Array.from({length: row.items}, (_, index) => itemFor(index, row.type)),
  };
}
