import type {AppNotification, DashboardOverview, DashboardService} from "@/types/dashboard-types";
import {MOCK_AUTH} from "./mock-auth-service";
import {mockDelay} from "./mock-http";
import {mockSession} from "./mock-session";

/** Fresh accounts see the empty dashboard from the design; the demo account sees the populated one. */
const EMPTY_OVERVIEW: DashboardOverview = {
  firstName: "Quadri",
  walletBalance: 0,
  stats: {
    totalBatches: 0,
    activeBatches: 0,
    completeBatches: 0,
    draftBatches: 0,
    totalShipments: 0,
    topLocker: null,
    totalSpend: 0,
    avgPerShipment: 0,
    activeShipments: 0,
    activeShipmentBatches: 0,
    deliveredLast30Days: 0,
    pending: 0,
    failed: 0,
  },
  recentShipments: [],
};

const DEMO_OVERVIEW: DashboardOverview = {
  firstName: "Quadri",
  walletBalance: 48500,
  stats: {
    totalBatches: 38,
    activeBatches: 6,
    completeBatches: 9,
    draftBatches: 1,
    totalShipments: 2878,
    topLocker: {code: "L04", area: "Surulere", deliveries: 318},
    totalSpend: 203219,
    avgPerShipment: 672,
    activeShipments: 38,
    activeShipmentBatches: 2,
    deliveredLast30Days: 1248,
    pending: 12,
    failed: 12,
  },
  recentShipments: [
    {
      id: "shp-1",
      recipient: "Khadija Rabiu",
      phone: "0803 441 2210",
      destination: "Surulere Hub — L04",
      size: "M",
      priority: "express",
      status: "in_transit",
    },
    {
      id: "shp-2",
      recipient: "Musa Abubakar",
      phone: "0706 228 5545",
      destination: "Apapa Port — L01",
      size: "M",
      priority: "standard",
      status: "delayed",
    },
    {
      id: "shp-3",
      recipient: "Adeola Ilesanmi",
      phone: "0803 222 1109",
      destination: "Victoria Island — L02",
      size: "S",
      priority: "standard",
      status: "failed",
    },
    {
      id: "shp-4",
      recipient: "Ebizi Tonbara",
      phone: "0701 558 4431",
      destination: "Ojota Terminal — L09",
      size: "B",
      priority: "standard",
      status: "delayed",
    },
    {
      id: "shp-5",
      recipient: "Bilkisu Suleiman",
      phone: "0803 222 1109",
      destination: "Apapa Port — L01",
      size: "S",
      priority: "standard",
      status: "delivered",
    },
  ],
};

const DEMO_NOTIFICATIONS: AppNotification[] = [
  {
    id: "ntf-1",
    icon: "batch",
    title: "Batch created successfully",
    body: "Your shipments have been created and are ready to be prepared. Print your labels and attach them to each package before marking the batch as ready.",
    time: "11:03 AM",
    day: "today",
    read: true,
  },
  {
    id: "ntf-2",
    icon: "package",
    title: "Packages picked up",
    body: "Your packages have been successfully collected and are now on their way to the destination lockers.",
    time: "11:03 AM",
    day: "today",
    read: false,
  },
  {
    id: "ntf-3",
    icon: "package",
    title: "Courier on the way",
    body: "A courier has been assigned and is heading to your location to pick up your packages. Please ensure all items are ready.",
    time: "11:03 PM",
    day: "yesterday",
    read: true,
  },
  {
    id: "ntf-4",
    icon: "wallet",
    title: "Wallet funded successfully",
    body: "Your wallet has been credited. You can now continue creating and sending shipments.",
    time: "11:03 AM",
    day: "yesterday",
    read: false,
  },
];

let notificationsMarkedRead = false;

/** In-memory stand-in for the backend while it does not exist. Never ships when `VITE_API_URL` is set. */
export const mockDashboardService: DashboardService = {
  getOverview: async () => {
    await mockDelay();
    if (mockSession.email === MOCK_AUTH.demoEmail) {
      return {...DEMO_OVERVIEW, walletBalance: mockSession.walletBalance ?? DEMO_OVERVIEW.walletBalance};
    }
    const firstName = mockSession.firstName ?? "Quadri";
    return {...EMPTY_OVERVIEW, firstName, walletBalance: mockSession.walletBalance ?? 0};
  },
  getNotifications: async () => {
    await mockDelay();
    if (mockSession.email !== MOCK_AUTH.demoEmail) return [];
    return DEMO_NOTIFICATIONS.map((notification) => (notificationsMarkedRead ? {...notification, read: true} : notification));
  },
  markAllNotificationsRead: async () => {
    await mockDelay();
    notificationsMarkedRead = true;
  },
};
