import type {NodeConnectivity, NodeStatus} from "@/types/nodes-types";

export interface NodeSeed {
  id: string;
  name: string;
  partner: string;
  zone: string;
  used: number;
  total: number;
  connectivity: NodeConnectivity;
  status: NodeStatus;
  position: [number, number];
}

type RawSeed = [
  id: string,
  name: string,
  partner: string,
  zone: string,
  used: number,
  total: number,
  connectivity: NodeConnectivity,
  status: NodeStatus,
  lng: number,
  lat: number,
];

/** Hand-authored Lagos nodes mirroring the Figma list — the mock fleet. */
const RAW_SEEDS: RawSeed[] = [
  ["ND-10076", "Total Energies VI", "Total Energies", "Lekki", 18, 24, "4g_lte", "online", 3.4219, 6.4281],
  ["ND-10077", "Lekki Shoprite", "Shoprite", "Lekki", 0, 40, "no_signal", "offline", 3.4732, 6.4478],
  ["ND-10078", "Lekki GT Bank Node", "GT Bank", "Lekki", 24, 24, "4g_lte", "online", 3.4501, 6.4355],
  ["ND-10079", "Oshodi Node", "Total Energies", "Oshodi", 18, 24, "4g_lte", "online", 3.3405, 6.556],
  ["ND-10080", "Surulere Mall", "UACN Holding", "Surulere", 0, 24, "4g_lte", "online", 3.3573, 6.4932],
  ["ND-10081", "Isolo BOVAS Station", "BOVAS", "Isolo", 1, 32, "unstable", "maintenance", 3.3245, 6.5268],
  ["ND-10082", "Lekki Mall Node", "Justrite Mall", "Lekki", 19, 32, "no_signal", "warning", 3.4921, 6.4301],
  ["ND-10083", "Lekki Market Node", "Lekki Market Hub", "Lekki", 27, 60, "3g", "online", 3.468, 6.455],
  ["ND-10084", "Maitama Prime", "FCDA Properties", "Isolo", 18, 32, "3g", "offline", 3.3119, 6.5401],
  ["ND-10085", "Ikorodu Shoprite", "Shoprite Holding", "Ikorodu", 18, 24, "no_signal", "online", 3.5079, 6.6151],
  ["ND-10086", "Yaba Tech Hub", "CcHub", "Yaba", 32, 32, "4g_lte", "full", 3.3769, 6.5105],
  ["ND-10087", "Apapa Wharf Node", "Apapa Port Co.", "Apapa", 8, 40, "unstable", "warning", 3.3602, 6.4498],
  ["ND-10088", "Ikeja GRA Node", "Mobil, Ikeja", "Ikeja", 24, 28, "4g_lte", "online", 3.3557, 6.5887],
  ["ND-10089", "Victoria Island Central", "Eko Hotels", "Victoria Island", 15, 24, "4g_lte", "online", 3.4172, 6.4283],
  ["ND-10090", "Festac Node", "Festac Mall", "Festac", 5, 24, "3g", "online", 3.2839, 6.4671],
  ["ND-10091", "Ajah Node", "Ajah Market Square", "Ajah", 12, 32, "4g_lte", "online", 3.5678, 6.4622],
  ["ND-10092", "Gbagada Node", "Gbagada Plaza", "Gbagada", 9, 24, "no_signal", "offline", 3.3902, 6.5566],
  ["ND-10093", "Egbeda Node", "Egbeda Filling", "Egbeda", 14, 24, "3g", "online", 3.2967, 6.5734],
  ["ND-10094", "Maryland Node", "Maryland Mall", "Maryland", 22, 24, "4g_lte", "online", 3.3692, 6.5709],
  ["ND-10095", "Ojota Node", "Ojota Park", "Ojota", 11, 24, "unstable", "online", 3.3856, 6.5851],
  ["ND-10096", "Ikoyi Node", "Ikoyi Plaza", "Ikoyi", 20, 24, "4g_lte", "online", 3.4356, 6.4533],
  ["ND-10097", "Agege Node", "Agege Station", "Agege", 13, 24, "3g", "online", 3.3254, 6.6188],
  ["ND-10098", "Mushin Node", "Mushin Market", "Mushin", 7, 24, "no_signal", "offline", 3.3456, 6.5301],
  ["ND-10099", "Berger Node", "Berger Yard", "Ojodu", 17, 24, "4g_lte", "online", 3.3601, 6.6402],
];

export const NODE_SEEDS: NodeSeed[] = RAW_SEEDS.map(([id, name, partner, zone, used, total, connectivity, status, lng, lat]) => ({
  id,
  name,
  partner,
  zone,
  used,
  total,
  connectivity,
  status,
  position: [lng, lat],
}));
