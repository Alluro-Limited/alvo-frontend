import type {SafeDuration, SafeNode, SafeOptions, SafeService, SafeSizeOption} from "@/types/safe-types";
import {mockDelay} from "./mock-http";

const base = {distance: "0.5km away", floor: "Ground Floor", access: "24/7 Access • CCTV & Security Guarded", status: "available" as const};

const NODES: SafeNode[] = [
  {
    id: "n-lekki",
    name: "Lekki Mall Node",
    address: "Second Entrance, Lekki Mall Node, Lagos State",
    safes: 15,
    sizes: "All sizes",
    ...base,
  },
  {
    id: "n-vi",
    name: "Victoria Island Plaza",
    address: "Plot 1, Ozumba Mbadiwe Avenue, VI, Lagos State",
    safes: 8,
    sizes: "All sizes",
    ...base,
  },
  {
    id: "n-ikeja",
    name: "Ikeja City Mall",
    address: "Ikeja Along, Obafemi Awolowo Way, Ikeja, Lagos State",
    safes: 4,
    sizes: "All sizes",
    ...base,
  },
  {
    id: "n-spice",
    name: "Spice Route",
    address: "19, Adeola Odeku Street, Victoria Island, Lagos State",
    safes: 6,
    sizes: "All sizes",
    ...base,
  },
  {
    id: "n-palms",
    name: "The Palms Shopping Mall",
    address: "Lekki-Epe Expressway, Lekki, Lagos State",
    safes: 11,
    sizes: "All sizes",
    ...base,
  },
  {id: "n-surulere", name: "Surulere Plaza", address: "Surulere, Lagos State", safes: 3, sizes: "All sizes", ...base},
  {
    id: "n-landmark",
    name: "The Landmark Centre",
    address: "Landmark Beach, Victoria Island, Lagos State",
    safes: 5,
    sizes: "All sizes",
    ...base,
  },
  {
    id: "n-mega",
    name: "Mega Plaza",
    address: "15, Adeola Odeku Street, Victoria Island, Lagos State",
    safes: 0,
    sizes: "All sizes",
    ...base,
  },
  {
    id: "n-oshodi",
    name: "Oshodi Mall Node",
    address: "Oshodi Transport Interchange, Lagos State",
    safes: 0,
    sizes: "All sizes",
    ...base,
    status: "offline",
  },
];

const SIZES: SafeSizeOption[] = [
  {id: "small", label: "Small", dims: "30x20x15cm", hourlyRate: 500},
  {id: "medium", label: "Medium", dims: "45x30x25cm", hourlyRate: 700},
  {id: "large", label: "Large", dims: "60x40x35cm", hourlyRate: 800},
];

const DURATIONS: SafeDuration[] = [
  {id: "d4", label: "4 Hours", hours: 4, until: "until 6:00 PM"},
  {id: "d8", label: "8 Hours", hours: 8, until: "until 10:00 PM"},
  {id: "d24", label: "1 Day", hours: 24, until: "until tomorrow, 2:00 PM"},
  {id: "d72", label: "3 Days", hours: 72, until: "until Fri, 2:00 PM"},
  {id: "d168", label: "7 Days", hours: 168, until: "until next Tue, 2:00 PM"},
];

const OPTIONS: SafeOptions = {sizes: SIZES, durations: DURATIONS};

export const mockSafeService: SafeService = {
  getNodes: async () => {
    await mockDelay();
    return NODES;
  },
  getOptions: async () => {
    await mockDelay(300);
    return OPTIONS;
  },
  getQuote: async (input) => {
    await mockDelay(300);
    const size = SIZES.find((s) => s.id === input.size) ?? SIZES[0];
    const duration = DURATIONS.find((d) => d.id === input.durationId) ?? DURATIONS[0];
    const amount = size.hourlyRate * duration.hours;
    return {
      lines: [
        {id: "safe", label: `Standard Safe (${duration.hours} hrs × ₦${size.hourlyRate.toLocaleString("en-US")}/hr)`, amount},
        {id: "fee", label: "Service Fee:", amount: 0},
      ],
      total: amount,
      walletBalance: 12500,
    };
  },
  reserve: async (request) => {
    await mockDelay();
    const node = NODES.find((n) => n.id === request.nodeId) ?? NODES[0];
    return {
      storageId: "STR9245",
      location: `${node.name} Locker Node, ${node.floor}, Near Entrance 2`,
      validUntil: "6:00 PM today",
      remaining: "3 hours 45 mins remaining",
      accessCode: "B-1247",
    };
  },
};
