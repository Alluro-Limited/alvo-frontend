import {fireEvent, screen, waitFor} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {nodesService} from "@/services/nodes-service";
import {renderRoute} from "@/test/render-route";
import type {NodeDetail} from "@/types/nodes-types";
import {NodeDetailPage} from "../node-detail";

vi.mock("@/services/nodes-service", () => ({
  nodesService: {
    getNodes: vi.fn(),
    getNodeDetail: vi.fn(),
    registerNode: vi.fn(),
    changeNodeStatus: vi.fn(),
  },
}));

const getNodeDetail = vi.mocked(nodesService.getNodeDetail);
const changeNodeStatus = vi.mocked(nodesService.changeNodeStatus);

function detail(overrides: Partial<NodeDetail> = {}): NodeDetail {
  return {
    id: "ND-10076",
    code: "LK-022",
    name: "Total Energies VI",
    status: "online",
    partner: "Total Energies",
    zone: "Lekki",
    region: "Lagos · Lekki",
    address: "Plot 12, Adeola Odeku, VI",
    installedAt: "2025-03-01T00:00:00.000Z",
    uptimeToday: 99.8,
    lastHeartbeatAt: new Date(Date.now() - 8000).toISOString(),
    connectivity: "4g_lte",
    pickupOccupancy: {used: 18, total: 24},
    compartments: [
      {
        key: "pickup",
        used: 18,
        total: 24,
        unit: "slots",
        breakdown: [
          {size: "small", count: 6, unit: "slots"},
          {size: "medium", count: 6, unit: "slots"},
          {size: "large", count: 6, unit: "slots"},
        ],
      },
      {
        key: "dropoff",
        used: 109,
        total: 2400,
        unit: "kg",
        breakdown: [{size: "small", count: 109, unit: "items"}],
      },
    ],
    sensors: [
      {key: "network", label: "Network signal", value: "4G LTE", tone: "ok"},
      {key: "power", label: "Power status", value: "Mains connected", tone: "ok"},
      {key: "door", label: "Door sensor", value: "Operational", tone: "ok"},
      {key: "tamper", label: "Tamper detection", value: "No incidents", tone: "ok"},
    ],
    contents: [
      {
        id: "PRV-88201",
        kind: "parcel",
        owner: "Kemi Adeyemi",
        slot: "A3",
        sinceAt: new Date(Date.now() - 7200_000).toISOString(),
        label: "Awaiting pickup",
      },
    ],
    maintenance: [{id: "mnt-1", title: "Scheduled service", at: "2026-04-10T00:00:00.000Z", vendor: "Techfix Ltd", status: "completed"}],
    statusOptions: [
      {status: "offline", reasons: ["power_failure", "connectivity_issue", "hardware_fault", "others"]},
      {status: "warning", reasons: ["partner_request", "contract_ended", "location_closed", "others"]},
      {status: "maintenance", reasons: ["scheduled_service", "compartment_repair", "hardware_upgrade", "partner_request", "others"]},
      {status: "full", reasons: null},
    ],
    position: [3.4219, 6.4281],
    ...overrides,
  };
}

function renderDetail(d: NodeDetail = detail()) {
  getNodeDetail.mockResolvedValue(d);
  renderRoute(() => <NodeDetailPage nodeId="ND-10076" />, "/nodes/$nodeId", "/nodes/ND-10076");
}

describe("NodeDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    changeNodeStatus.mockResolvedValue({id: "ND-10076", status: "offline"});
  });

  it("shows the skeleton while the node loads", async () => {
    getNodeDetail.mockReturnValue(new Promise(() => {}));
    renderRoute(() => <NodeDetailPage nodeId="ND-10076" />, "/nodes/$nodeId", "/nodes/ND-10076");
    await waitFor(() => expect(document.querySelector("[aria-busy='true']")).toBeTruthy());
  });

  it("renders the header card, stats, compartments, sensors, contents and maintenance", async () => {
    renderDetail();

    expect(await screen.findByRole("heading", {name: "Total Energies VI"})).toBeTruthy();
    expect(screen.getByText("nodes.status_online")).toBeTruthy();
    expect(screen.getByText("Total Energies")).toBeTruthy();
    expect(screen.getByText("Plot 12, Adeola Odeku, VI")).toBeTruthy();
    expect(screen.getByText("99.8%")).toBeTruthy();

    expect(screen.getByText("nodes.stat_last_heartbeat")).toBeTruthy();
    expect(screen.getByText("nodes.stat_pickup_occupancy")).toBeTruthy();
    expect(screen.getByText("Lagos · Lekki")).toBeTruthy();

    expect(screen.getByText("nodes.compartments_title")).toBeTruthy();
    expect(screen.getByText("Network signal")).toBeTruthy();
    expect(screen.getByText("4G LTE")).toBeTruthy();
    expect(screen.getByText("PRV-88201 · Kemi Adeyemi")).toBeTruthy();
    expect(screen.getByText("Scheduled service")).toBeTruthy();
  });

  it("renders the empty contents and maintenance states", async () => {
    renderDetail(detail({contents: [], maintenance: []}));
    expect(await screen.findByText("nodes.contents_empty_title")).toBeTruthy();
    expect(screen.getByText("nodes.maintenance_empty_title")).toBeTruthy();
  });

  it("shows the error state and retries", async () => {
    getNodeDetail.mockRejectedValueOnce(new Error("down")).mockResolvedValue(detail());
    renderRoute(() => <NodeDetailPage nodeId="ND-10076" />, "/nodes/$nodeId", "/nodes/ND-10076");

    expect(await screen.findByText("nodes.detail_error_title")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "nodes.retry"}));
    expect(await screen.findByRole("heading", {name: "Total Energies VI"})).toBeTruthy();
  });

  it("changes status through the modal and shows the toast", async () => {
    renderDetail();
    await screen.findByRole("heading", {name: "Total Energies VI"});
    fireEvent.click(screen.getByRole("button", {name: "nodes.change_status"}));

    expect(await screen.findByText("nodes.status_dialog_title")).toBeTruthy();
    fireEvent.click(screen.getByRole("radio", {name: "nodes.status_offline"}));
    fireEvent.click(screen.getByRole("radio", {name: "nodes.reason_power_failure"}));
    fireEvent.click(screen.getByRole("button", {name: "nodes.status_submit"}));

    await waitFor(() =>
      expect(changeNodeStatus).toHaveBeenCalledWith("ND-10076", {status: "offline", reason: "power_failure", notes: undefined})
    );
    expect(await screen.findByRole("status")).toBeTruthy();
  });

  it("skips the reason list for Full and reveals notes for Others", async () => {
    renderDetail();
    await screen.findByRole("heading", {name: "Total Energies VI"});
    fireEvent.click(screen.getByRole("button", {name: "nodes.change_status"}));
    await screen.findByText("nodes.status_dialog_title");

    fireEvent.click(screen.getByRole("radio", {name: "nodes.status_full"}));
    expect(screen.queryByText("nodes.reason_label")).toBeNull();

    fireEvent.click(screen.getByRole("radio", {name: "nodes.status_offline"}));
    fireEvent.click(screen.getByRole("radio", {name: "nodes.reason_others"}));
    expect(await screen.findByPlaceholderText("nodes.notes_placeholder")).toBeTruthy();
  });

  it("preselects maintenance from the Schedule Maintenance action", async () => {
    renderDetail();
    await screen.findByRole("heading", {name: "Total Energies VI"});
    fireEvent.click(screen.getByRole("button", {name: "nodes.schedule_maintenance"}));

    await screen.findByText("nodes.status_dialog_title");
    expect(screen.getByRole("radio", {name: "nodes.status_maintenance"}).getAttribute("aria-checked")).toBe("true");
    fireEvent.click(screen.getByRole("radio", {name: "nodes.reason_scheduled_service"}));
    fireEvent.click(screen.getByRole("button", {name: "nodes.status_submit"}));
    await waitFor(() =>
      expect(changeNodeStatus).toHaveBeenCalledWith("ND-10076", {status: "maintenance", reason: "scheduled_service", notes: undefined})
    );
  });
});
