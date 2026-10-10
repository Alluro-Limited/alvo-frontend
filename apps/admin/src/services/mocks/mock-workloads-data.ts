import type {ParcelDetail, ParcelRow, ParcelRoute, WorkloadFilterOptions, WorkloadMetrics} from "@/types/workloads-types";

export const WORKLOAD_METRICS: WorkloadMetrics = {ongoing: 3, pendingPickup: 12, expired: 1, slaAtRisk: 2, flagged: 0};

export const WORKLOAD_FILTER_OPTIONS: WorkloadFilterOptions = {
  statuses: ["pending_pickup", "in_transit", "delivered", "failed", "expired"],
  locations: [
    {id: "LK-022", label: "Ikeja (LK-022)"},
    {id: "IK-023", label: "Ikeja (IK-023)"},
    {id: "LK-015", label: "Lekki (LK-015)"},
    {id: "VI-007", label: "Victoria Island (VI-007)"},
  ],
};

/** Rows behind the Single Send table — mirrors the populated Figma frame. */
export const PARCEL_ROWS: ParcelRow[] = [
  {
    id: "PRV-88201",
    sender: "Hauwa Zubairu",
    destination: "Ikeja, Lagos (Ik-022)",
    courierId: "PRG-023",
    destinationNodeId: "LK-022",
    status: "pending_pickup",
    slaRemainingMin: 74,
    flagged: false,
  },
  {
    id: "PRV-88202",
    sender: "Miebi Obubra",
    destination: "Ikeja, Lagos (Ik-022)",
    courierId: "PRG-023",
    destinationNodeId: "LK-022",
    status: "delivered",
    slaRemainingMin: 56,
    flagged: false,
  },
  {
    id: "PRV-88203",
    sender: "Hauwa Kabiru",
    destination: "Ikeja, Lagos (Ik-022)",
    courierId: "PRG-023",
    destinationNodeId: "LK-022",
    status: "pending_pickup",
    slaRemainingMin: 72,
    flagged: false,
  },
  {
    id: "PRV-88204",
    sender: "Umar Usman",
    destination: "Ikeja, Lagos (Ik-022)",
    courierId: "PRG-023",
    destinationNodeId: "LK-022",
    status: "in_transit",
    slaRemainingMin: 134,
    flagged: false,
  },
  {
    id: "PRV-88190",
    sender: "Emeka Anyaoku",
    destination: "Ikeja, Lagos (Ik-022)",
    courierId: "PRG-023",
    destinationNodeId: "LK-022",
    status: "failed",
    slaRemainingMin: 134,
    flagged: false,
  },
  {
    id: "PRV-88206",
    sender: "Ekiye Opuene",
    destination: "Ikeja, Lagos (Ik-022)",
    courierId: "PRG-023",
    destinationNodeId: "LK-022",
    status: "pending_pickup",
    slaRemainingMin: null,
    flagged: false,
  },
  {
    id: "PRV-88207",
    sender: "Chisom Agu",
    destination: "Lekki, Lagos (LK-015)",
    courierId: "PRG-041",
    destinationNodeId: "LK-015",
    status: "delivered",
    slaRemainingMin: 134,
    flagged: false,
  },
  {
    id: "PRV-88208",
    sender: "Kemi Oladipo",
    destination: "Ikeja, Lagos (Ik-022)",
    courierId: "PRG-023",
    destinationNodeId: "LK-022",
    status: "delivered",
    slaRemainingMin: 134,
    flagged: false,
  },
  {
    id: "PRV-88209",
    sender: "Seiye Amakiri",
    destination: "Ikeja, Lagos (Ik-022)",
    courierId: "PRG-023",
    destinationNodeId: "LK-022",
    status: "delivered",
    slaRemainingMin: 134,
    flagged: false,
  },
  {
    id: "PRV-88183",
    sender: "Olanrewaju Quadri",
    destination: "Lekki, Lagos (LK-015)",
    courierId: "PRG-023",
    destinationNodeId: "LK-015",
    status: "in_transit",
    slaRemainingMin: 182,
    flagged: false,
  },
  {
    id: "PRV-88211",
    sender: "Tobi Falana",
    destination: "Ikoyi, Lagos (VI-007)",
    courierId: "PRG-051",
    destinationNodeId: "VI-007",
    status: "expired",
    slaRemainingMin: null,
    flagged: false,
  },
  {
    id: "PRV-88212",
    sender: "Adaeze Nwosu",
    destination: "Lekki, Lagos (LK-015)",
    courierId: "PRG-041",
    destinationNodeId: "LK-015",
    status: "pending_pickup",
    slaRemainingMin: 95,
    flagged: false,
  },
];

/** The total the footer reports — the mock pretends there are more pages than the fixture covers. */
export const MOCK_PARCEL_TOTAL = 343;
export const MOCK_PAGE_SIZE = 10;

const LAGOS = {
  ikeja: [3.3492, 6.6018] as [number, number],
  lekki: [3.4736, 6.4474] as [number, number],
  ikoyi: [3.4326, 6.4541] as [number, number],
};

/** Full detail for the drawer showcase parcel — matches the drawer/track frames. */
const PRV_88183: ParcelDetail = {
  id: "PRV-88183",
  serviceType: "standard",
  status: "in_transit",
  statusNote: "Departed on 16 Mar 2026 at 2:34 PM",
  flag: null,
  sender: "Olanrewaju Quadri",
  recipient: "Dayo Ogunsanya",
  courier: {id: "PRG-023", name: "Ajadi Johnson"},
  route: {from: "Ikeja (IK-023)", to: "Lekki (LK-015)"},
  size: "Small - 1.8kg",
  charged: 1450,
  slaRemainingMin: 182,
  routes: [
    {
      steps: [
        {key: "created", actor: "Via mobile app", at: "2026-03-16T08:02:00"},
        {key: "dropped_at_node", actor: "LK-022", at: "2026-03-16T09:15:00"},
        {key: "picked_up", actor: "PRG-023", at: "2026-03-16T10:40:00"},
        {key: "delivered"},
        {key: "collected"},
      ],
    },
  ],
  tracking: {
    route: [LAGOS.ikeja, [3.365, 6.585], [3.39, 6.56], [3.42, 6.53], [3.45, 6.49], LAGOS.lekki],
    stops: [
      {id: "s1", label: "P01", position: [3.462, 6.483], tone: "default"},
      {id: "s2", label: "P02", position: [3.455, 6.512], tone: "default"},
      {id: "s3", label: "P04", position: [3.402, 6.542], tone: "alert"},
      {id: "s4", label: "P05", position: [3.472, 6.497], tone: "default"},
      {id: "s5", label: "P06", position: [3.405, 6.493], tone: "default"},
      {id: "s6", label: "P11", position: [3.36, 6.485], tone: "default"},
      {id: "s7", label: "P12", position: [3.382, 6.523], tone: "default"},
      {id: "s8", label: "P-001", position: [3.452, 6.552], tone: "default"},
    ],
    courierPosition: [3.365, 6.505],
    etaMinutes: 2,
    destinationPosition: LAGOS.lekki,
  },
};

/** The single default route leg for parcels that carry no batch-specific routes. */
function defaultRouteFor(row: ParcelRow): ParcelRoute[] {
  const done = row.status === "delivered";
  return [
    {
      steps: [
        {key: "created", actor: "Via mobile app", at: "2026-03-16T08:02:00"},
        {key: "dropped_at_node", actor: "LK-022", at: "2026-03-16T09:15:00"},
        {
          key: "picked_up",
          actor: row.courierId ?? undefined,
          at: done || row.status === "in_transit" ? "2026-03-16T10:40:00" : undefined,
        },
        {key: "delivered", at: done ? "2026-03-16T11:55:00" : undefined},
        {key: "collected"},
      ],
    },
  ];
}

/** Generic detail for any other parcel id — derived from its row so every row opens a real drawer. */
export function detailFor(row: ParcelRow, routes?: ParcelRoute[]): ParcelDetail {
  return {
    id: row.id,
    serviceType: "standard",
    status: row.status,
    statusNote: row.status === "in_transit" ? "Departed on 16 Mar 2026 at 2:34 PM" : undefined,
    flag: row.flagged ? {reason: "delivery_dispute", at: "2026-03-16T11:00:00"} : null,
    sender: row.sender,
    recipient: "Dayo Ogunsanya",
    courier: row.courierId ? {id: row.courierId, name: "Ajadi Johnson"} : null,
    route: {from: "Ikeja (IK-023)", to: row.destination},
    size: "Small - 1.8kg",
    charged: 1450,
    slaRemainingMin: row.slaRemainingMin,
    routes: routes ?? defaultRouteFor(row),
    tracking: row.status === "in_transit" || row.status === "failed" ? PRV_88183.tracking : undefined,
  };
}

export function parcelDetailFor(id: string): ParcelDetail | undefined {
  const row = PARCEL_ROWS.find((parcel) => parcel.id === id);
  return row ? (id === "PRV-88183" ? PRV_88183 : detailFor(row)) : undefined;
}
