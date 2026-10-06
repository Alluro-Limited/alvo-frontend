import {fireEvent, screen, waitFor} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {nodesService} from "@/services/nodes-service";
import {renderRoute} from "@/test/render-route";
import type {NodeListResponse, NodeRow} from "@/types/nodes-types";
import {NodesPage} from "../nodes";

vi.mock("@/services/nodes-service", () => ({
  nodesService: {
    getNodes: vi.fn(),
    getNodeDetail: vi.fn(),
    registerNode: vi.fn(),
    changeNodeStatus: vi.fn(),
  },
}));

const getNodes = vi.mocked(nodesService.getNodes);
const registerNode = vi.mocked(nodesService.registerNode);

const ROW: NodeRow = {
  id: "ND-10076",
  name: "Total Energies VI",
  partner: "Total Energies",
  zone: "Lekki",
  capacity: {used: 18, total: 24},
  connectivity: "4g_lte",
  status: "online",
  position: [3.4219, 6.4281],
};

function list(overrides: Partial<NodeListResponse["nodes"]> = {}): NodeListResponse {
  return {
    metrics: {total: 53, online: 30, offline: 5, warning: 2, maintenance: 4, fullCapacity: 12},
    filters: {statuses: ["online", "offline", "warning", "maintenance", "full", "decommissioned"]},
    nodes: {
      items: [ROW, {...ROW, id: "ND-10077", name: "Lekki Shoprite", status: "offline", connectivity: "no_signal"}],
      page: 1,
      pageSize: 10,
      total: 53,
      ...overrides,
    },
  };
}

describe("NodesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getNodes.mockResolvedValue(list());
  });

  it("shows the skeleton while nodes load", async () => {
    getNodes.mockReturnValue(new Promise(() => {}));
    renderRoute(NodesPage, "/nodes");
    await waitFor(() => expect(document.querySelector("[aria-busy='true']")).toBeTruthy());
  });

  it("renders metrics, the table and pagination once loaded", async () => {
    renderRoute(NodesPage, "/nodes");

    expect(await screen.findByText("ND-10076")).toBeTruthy();
    expect(screen.getByText("Total Energies VI")).toBeTruthy();
    expect(screen.getByText("nodes.metric_total")).toBeTruthy();
    expect(screen.getByText("nodes.metric_full_capacity")).toBeTruthy();
    expect(screen.getAllByText("nodes.capacity_used_total").length).toBe(2);
    expect(screen.getByText("nodes.network_4g_lte")).toBeTruthy();
    expect(screen.getByText("workloads.showing")).toBeTruthy();
  });

  it("fetches with the search query and status filter", async () => {
    renderRoute(NodesPage, "/nodes");
    await screen.findByText("ND-10076");

    fireEvent.change(screen.getByPlaceholderText("nodes.search_placeholder"), {target: {value: "shoprite"}});
    await waitFor(() => expect(getNodes).toHaveBeenCalledWith(expect.objectContaining({query: "shoprite", page: 1})));

    fireEvent.change(screen.getAllByRole("combobox")[0], {target: {value: "offline"}});
    await waitFor(() => expect(getNodes).toHaveBeenCalledWith(expect.objectContaining({status: "offline", page: 1})));
  });

  it("renders the first-run empty state with a register action", async () => {
    getNodes.mockResolvedValue(list({items: [], total: 0}));
    renderRoute(NodesPage, "/nodes");

    expect(await screen.findByText("nodes.empty_title")).toBeTruthy();
    expect(screen.getByText("nodes.empty_description")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "nodes.empty_action"}));
    expect(await screen.findByText("nodes.register_title")).toBeTruthy();
  });

  it("renders the filtered-empty state and clears filters", async () => {
    getNodes.mockResolvedValue(list({items: [], total: 0}));
    renderRoute(NodesPage, "/nodes");
    await screen.findByText("nodes.empty_title");

    fireEvent.change(screen.getByPlaceholderText("nodes.search_placeholder"), {target: {value: "zzz"}});
    expect(await screen.findByText("nodes.filtered_empty_title")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "nodes.clear_filter"}));
    await waitFor(() => expect(getNodes).toHaveBeenLastCalledWith(expect.objectContaining({query: undefined})));
  });

  it("shows the error state and retries", async () => {
    getNodes.mockRejectedValueOnce(new Error("down")).mockResolvedValue(list());
    renderRoute(NodesPage, "/nodes");

    expect(await screen.findByText("nodes.list_error_title")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "nodes.retry"}));
    expect(await screen.findByText("ND-10076")).toBeTruthy();
  });

  it("navigates to the node detail when a row is clicked", async () => {
    renderRoute(NodesPage, "/nodes");
    fireEvent.click(await screen.findByText("ND-10076"));
    expect(await screen.findByText("stub:/nodes/$nodeId")).toBeTruthy();
  });

  it("registers a node through the four-step wizard and shows the toast", async () => {
    registerNode.mockResolvedValue({...ROW, id: "ND-10100", status: "offline"});
    renderRoute(NodesPage, "/nodes");
    await screen.findByText("ND-10076");

    fireEvent.click(screen.getByRole("button", {name: "nodes.register_node"}));
    expect(await screen.findByText("nodes.register_title")).toBeTruthy();

    // Continue is gated — submitting an empty step stays on step 1 and shows errors.
    fireEvent.click(screen.getByRole("button", {name: "nodes.continue"}));
    expect(screen.getAllByText("nodes.error_required").length).toBeGreaterThan(0);

    fireEvent.change(screen.getByPlaceholderText("nodes.field_node_name_placeholder"), {target: {value: "Surulere Node"}});
    fireEvent.change(screen.getByPlaceholderText("nodes.field_partner_placeholder"), {target: {value: "Surulere Mall"}});
    fireEvent.change(screen.getByPlaceholderText("nodes.field_region_placeholder"), {target: {value: "Lagos Mainland"}});
    fireEvent.click(screen.getByRole("button", {name: "nodes.continue"}));

    expect(await screen.findByPlaceholderText("nodes.field_zone_placeholder")).toBeTruthy();
    fireEvent.change(screen.getByPlaceholderText("nodes.field_zone_placeholder"), {target: {value: "Surulere"}});
    fireEvent.change(screen.getByPlaceholderText("nodes.field_address_placeholder"), {target: {value: "12 Bode Thomas"}});
    fireEvent.change(screen.getByPlaceholderText("nodes.field_latitude_placeholder"), {target: {value: "6.5"}});
    fireEvent.change(screen.getByPlaceholderText("nodes.field_longitude_placeholder"), {target: {value: "3.35"}});
    fireEvent.click(screen.getByRole("button", {name: "nodes.continue"}));

    expect(await screen.findByText("nodes.capacity_small")).toBeTruthy();
    fireEvent.click(screen.getAllByRole("button", {name: "nodes.counter_increase_aria"})[0]);
    fireEvent.click(screen.getByRole("button", {name: "nodes.continue"}));

    expect(await screen.findByText("nodes.review_basic_title")).toBeTruthy();
    expect(screen.getByText("Surulere Node")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "nodes.register_submit"}));

    await waitFor(() =>
      expect(registerNode).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Surulere Node",
          zone: "Surulere",
          latitude: 6.5,
          longitude: 3.35,
          capacity: {small: 1, medium: 0, large: 0, dropoffKg: 0},
        })
      )
    );
    expect(await screen.findByRole("status")).toBeTruthy();
  });
});
