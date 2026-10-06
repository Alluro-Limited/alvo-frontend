import {API_ERROR_CODES} from "@/lib/api-errors";
import type {ChangeNodeStatusInput, NodeListParams, NodeRow, NodesService, RegisterNodeInput} from "@/types/nodes-types";
import {mockDelay, mockHttpError} from "./mock-http";
import {nodeDetailFor} from "./mock-node-detail";
import {MOCK_NODE_PAGE_SIZE, MOCK_NODE_TOTAL, NODE_STATUS_FILTERS, nodeMetricsFor, nodeRowsStore} from "./mock-nodes-data";

function applyNodeFilters(params: NodeListParams & {ids?: string[]}) {
  const q = params.query?.trim().toLowerCase();
  let items = nodeRowsStore;
  if (params.status) items = items.filter((row) => row.status === params.status);
  if (q) items = items.filter((row) => [row.id, row.name, row.partner, row.zone].some((field) => field.toLowerCase().includes(q)));
  return items;
}

let nextNodeSerial = 10100;

/** In-memory stand-in for the nodes API while it does not exist. */
export const mockNodesService: NodesService = {
  getNodes: async (params) => {
    await mockDelay();
    const items = applyNodeFilters(params);
    const start = (params.page - 1) * MOCK_NODE_PAGE_SIZE;
    return {
      metrics: nodeMetricsFor(nodeRowsStore),
      nodes: {
        items: items.slice(start, start + MOCK_NODE_PAGE_SIZE),
        page: params.page,
        pageSize: MOCK_NODE_PAGE_SIZE,
        total: items.length === nodeRowsStore.length ? MOCK_NODE_TOTAL : items.length,
      },
      filters: {statuses: NODE_STATUS_FILTERS},
    };
  },
  getNodeDetail: async (id) => {
    await mockDelay();
    const detail = nodeDetailFor(id);
    if (!detail) throw mockHttpError(`nodes/${id}`, API_ERROR_CODES.NOT_FOUND);
    return detail;
  },
  registerNode: async (input: RegisterNodeInput) => {
    await mockDelay();
    const row: NodeRow = {
      id: `ND-${nextNodeSerial++}`,
      name: input.name,
      partner: input.partner,
      zone: input.zone,
      capacity: {used: 0, total: input.capacity.small + input.capacity.medium + input.capacity.large},
      connectivity: "no_signal",
      status: "offline",
      position: [input.longitude, input.latitude],
    };
    nodeRowsStore.unshift(row);
    return row;
  },
  changeNodeStatus: async (id, input: ChangeNodeStatusInput) => {
    await mockDelay();
    const row = nodeRowsStore.find((node) => node.id === id);
    if (!row) throw mockHttpError(`nodes/${id}/status`, API_ERROR_CODES.NOT_FOUND);
    row.status = input.status;
    return {id, status: input.status};
  },
};
