import {apiClient} from "@/services/api-client";
import type {ApiGetNodeResponse, ApiListNodesResponse, ApiNode} from "@/types/api-types";
import type {AreaResult, HomeService, LockerDetail, LockerPin} from "@/types/home-types";

const AREA_KEY = "alvo.user-pwa.area";
const PIN_COLOR = "#00a996";
/** Keeps pins off the map edge when projecting real coordinates onto the artwork. */
const PAD = 12;

/**
 * Pins are percentages of the static map image; the API gives lat/lng. Until the map
 * carries real bounds, each node's position is normalized across the set's bounding box —
 * relative layout is right, geography is not.
 */
const toPins = (nodes: ApiNode[]): LockerPin[] => {
  const lats = nodes.map((n) => n.lat);
  const lngs = nodes.map((n) => n.lng);
  const [minLat, maxLat] = [Math.min(...lats), Math.max(...lats)];
  const [minLng, maxLng] = [Math.min(...lngs), Math.max(...lngs)];
  const spread = (v: number, lo: number, hi: number) => (hi === lo ? 0.5 : (v - lo) / (hi - lo));
  return nodes.map((node) => ({
    id: node.id,
    label: node.code || node.name,
    x: PAD + spread(node.lng, minLng, maxLng) * (100 - 2 * PAD),
    // Lat grows north, the map's y grows down.
    y: PAD + (1 - spread(node.lat, minLat, maxLat)) * (100 - 2 * PAD),
    color: PIN_COLOR,
  }));
};

/**
 * Home against `v1/nodes`. The area label and area search have no endpoint (no geocoder
 * in the API) — the label persists in localStorage and search stays empty for now.
 */
export const httpHomeService: HomeService = {
  getArea: async () => localStorage.getItem(AREA_KEY) ?? "Lagos",
  setArea: async (area) => {
    localStorage.setItem(AREA_KEY, area);
  },
  getLockers: async () => {
    const res = await apiClient.get("v1/nodes").json<ApiListNodesResponse>();
    return toPins(res.nodes);
  },
  getLocker: async (id): Promise<LockerDetail> => {
    const res = await apiClient.get(`v1/nodes/${id}`).json<ApiGetNodeResponse>();
    const {node} = res;
    const slots = (node.available?.small ?? 0) + (node.available?.medium ?? 0) + (node.available?.large ?? 0);
    return {id: node.id, name: node.name, available: node.status === "NODE_STATUS_AVAILABLE", slots};
  },
  searchAreas: async (): Promise<AreaResult[]> => [],
  getWatches: async () => {
    const res = await apiClient.get("v1/me/node-watches").json<{watches: {node: ApiNode}[]}>();
    return toPins(res.watches.map((w) => w.node));
  },
  watchNode: async (nodeId) => {
    await apiClient.put(`v1/me/node-watches/${nodeId}`);
  },
  unwatchNode: async (nodeId) => {
    await apiClient.delete(`v1/me/node-watches/${nodeId}`);
  },
};
