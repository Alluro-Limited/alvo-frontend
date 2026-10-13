import type {BookingRequest, LockerNode, QuoteInput, SendBooking, SendQuote, SendService} from "@/types/send-types";
import {mockDelay} from "./mock-http";

const base = {distance: "0.5km away", floor: "Ground Floor", access: "24/7 Access • CCTV & Security Guarded"};

const NODES: LockerNode[] = [
  {
    id: "n-lekki",
    name: "Lekki Mall Node",
    address: "Second Entrance, Lekki Mall Node, Lagos State",
    status: "available",
    sizes: "All sizes",
    ...base,
  },
  {
    id: "n-vi",
    name: "Victoria Island Plaza",
    address: "Plot 1, Ozumba Mbadiwe Avenue, VI, Lagos State",
    status: "available",
    sizes: "All sizes",
    ...base,
  },
  {
    id: "n-ikeja",
    name: "Ikeja City Mall",
    address: "Ikeja Along, Obafemi Awolowo Way, Ikeja, Lagos State",
    status: "available",
    sizes: "All sizes",
    ...base,
  },
  {
    id: "n-spice",
    name: "Spice Route",
    address: "19, Adeola Odeku Street, Victoria Island, Lagos State",
    status: "available",
    sizes: "All sizes",
    ...base,
  },
  {
    id: "n-palms",
    name: "The Palms Shopping Mall",
    address: "Lekki-Epe Expressway, Lekki, Lagos State",
    status: "available",
    sizes: "All sizes",
    ...base,
  },
  {id: "n-surulere", name: "Surulere Plaza", address: "Surulere, Lagos State", status: "available", sizes: "All sizes", ...base},
  {
    id: "n-landmark",
    name: "The Landmark Centre",
    address: "Landmark Beach, Victoria Island, Lagos State",
    status: "available",
    sizes: "All sizes",
    ...base,
  },
  {
    id: "n-mega",
    name: "Mega Plaza",
    address: "15, Adeola Odeku Street, Victoria Island, Lagos State",
    status: "available",
    sizes: "All sizes",
    ...base,
  },
  {
    id: "n-oshodi",
    name: "Oshodi Mall Node",
    address: "Oshodi Transport Interchange, Lagos State",
    status: "offline",
    sizes: "All sizes",
    ...base,
  },
];

const ARRIVALS: Record<QuoteInput["speed"], string> = {
  standard: "Tomorrow, 8:00 AM",
  same_day: "Today, 9:00 PM",
  express: "Today, 4:00 PM",
};

/** In-memory stand-in for the backend while it does not exist. Never ships when `VITE_API_URL` is set. */
export const mockSendService: SendService = {
  getNodes: async () => {
    await mockDelay();
    return NODES;
  },
  getQuote: async ({size, fragile, speed}): Promise<SendQuote> => {
    await mockDelay(300);
    const lines = [
      {id: "base", label: "Base Delivery:", amount: size === "small" ? 500 : size === "medium" ? 1000 : 1500},
      ...(fragile ? [{id: "fragile", label: "Fragile Handling:", amount: 200}] : []),
      ...(speed === "express" ? [{id: "express", label: "Express Delivery:", amount: 400}] : []),
      ...(speed === "same_day" ? [{id: "same_day", label: "Same Day:", amount: 400}] : []),
    ];
    return {lines, total: lines.reduce((sum, l) => sum + l.amount, 0), arrival: ARRIVALS[speed], walletBalance: 500};
  },
  createBooking: async (request: BookingRequest): Promise<SendBooking> => {
    await mockDelay();
    const origin = NODES.find((n) => n.id === request.originNodeId) ?? NODES[0];
    return {
      trackingNumber: "PKG4728",
      dropOffCode: "B-1247",
      dropOffLocation: `${origin.name}, Ground Floor, Near Entrance 2`,
      validUntil: "Dec 22, 11:34 AM",
      remaining: "7 hours 59 mins remaining",
    };
  },
};
