import {fireEvent, screen, waitFor} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {workloadsService} from "@/services/workloads-service";
import {renderRoute} from "@/test/render-route";
import type {ParcelDetail, WorkloadListResponse} from "@/types/workloads-types";
import {WorkloadsPage} from "../workloads";

vi.mock("@/services/workloads-service", () => ({
  workloadsService: {getWorkloads: vi.fn(), getParcelDetail: vi.fn(), flagParcels: vi.fn(), exportList: vi.fn()},
}));

const getWorkloads = vi.mocked(workloadsService.getWorkloads);
const getParcelDetail = vi.mocked(workloadsService.getParcelDetail);
const flagParcels = vi.mocked(workloadsService.flagParcels);

function list(overrides: Partial<WorkloadListResponse["parcels"]> = {}): WorkloadListResponse {
  return {
    metrics: {ongoing: 3, pendingPickup: 12, expired: 1, slaAtRisk: 2, flagged: 0},
    filters: {
      statuses: ["pending_pickup", "in_transit", "delivered", "failed", "expired"],
      locations: [{id: "LK-022", label: "Ikeja (LK-022)"}],
    },
    parcels: {
      items: [
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
          id: "PRV-88201",
          sender: "Hauwa Zubairu",
          destination: "Ikeja, Lagos (Ik-022)",
          courierId: "PRG-023",
          destinationNodeId: "LK-022",
          status: "pending_pickup",
          slaRemainingMin: 74,
          flagged: false,
        },
      ],
      page: 1,
      pageSize: 10,
      total: 343,
      ...overrides,
    },
  };
}

function detail(overrides: Partial<ParcelDetail> = {}): ParcelDetail {
  return {
    id: "PRV-88183",
    serviceType: "standard",
    status: "in_transit",
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
          {key: "dropped_at_node", at: "2026-03-16T09:15:00"},
          {key: "picked_up"},
          {key: "delivered"},
          {key: "collected"},
        ],
      },
    ],
    ...overrides,
  };
}

describe("WorkloadsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getWorkloads.mockResolvedValue(list());
    getParcelDetail.mockResolvedValue(detail());
    flagParcels.mockResolvedValue({flagged: 1});
  });

  it("shows the skeleton while parcels load", async () => {
    getWorkloads.mockReturnValue(new Promise(() => {}));
    renderRoute(WorkloadsPage, "/workloads");
    await waitFor(() => expect(document.querySelector("[aria-busy='true']")).toBeTruthy());
  });

  it("renders metrics, the table and pagination once loaded", async () => {
    renderRoute(WorkloadsPage, "/workloads");

    expect(await screen.findByText("PRV-88183")).toBeTruthy();
    expect(screen.getByText("workloads.metric_ongoing")).toBeTruthy();
    expect(screen.getByText("PRV-88201")).toBeTruthy();
    expect(screen.getByText("workloads.showing")).toBeTruthy();
  });

  it("renders the empty state when the list is empty", async () => {
    getWorkloads.mockResolvedValue(list({items: [], total: 0}));
    renderRoute(WorkloadsPage, "/workloads");

    expect(await screen.findByText("workloads.empty_title")).toBeTruthy();
    expect(screen.getByText("workloads.empty_description")).toBeTruthy();
  });

  it("shows the error state and retries", async () => {
    getWorkloads.mockRejectedValueOnce(new Error("down")).mockResolvedValue(list());
    renderRoute(WorkloadsPage, "/workloads");

    expect(await screen.findByText("workloads.load_error_title")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "workloads.retry"}));
    expect(await screen.findByText("PRV-88183")).toBeTruthy();
  });

  it("opens the parcel drawer when a row is clicked", async () => {
    renderRoute(WorkloadsPage, "/workloads");
    fireEvent.click(await screen.findByText("PRV-88183"));

    expect(await screen.findByText("workloads.drawer_title")).toBeTruthy();
    expect(await screen.findByText("workloads.timeline_title")).toBeTruthy();
    expect(getParcelDetail).toHaveBeenCalledWith("PRV-88183");
  });

  it("flags a parcel from the drawer and shows the toast", async () => {
    renderRoute(WorkloadsPage, "/workloads");
    fireEvent.click(await screen.findByText("PRV-88183"));
    fireEvent.click(await screen.findByRole("button", {name: "workloads.flag_for_review"}));

    fireEvent.change(screen.getByRole("combobox"), {target: {value: "damaged_item"}});
    fireEvent.click(screen.getByRole("button", {name: "workloads.flag_confirm"}));

    expect(await screen.findByRole("status")).toBeTruthy();
    expect(flagParcels).toHaveBeenCalledWith({ids: ["PRV-88183"], reason: "damaged_item", notes: undefined});
  });

  it("shows the selection bar and bulk-flags through the same modal", async () => {
    renderRoute(WorkloadsPage, "/workloads");
    await screen.findByText("PRV-88183");

    fireEvent.click(screen.getByRole("checkbox", {name: "PRV-88183"}));
    fireEvent.click(screen.getByRole("checkbox", {name: "PRV-88201"}));
    expect(screen.getByText("workloads.selected_count")).toBeTruthy();

    fireEvent.click(screen.getAllByRole("button", {name: "workloads.flag_for_review"})[0]);
    fireEvent.change(await screen.findByRole("combobox"), {target: {value: "other"}});
    fireEvent.click(screen.getByRole("button", {name: "workloads.flag_confirm"}));

    await waitFor(() =>
      expect(flagParcels).toHaveBeenCalledWith(expect.objectContaining({ids: ["PRV-88183", "PRV-88201"], reason: "other"}))
    );
  });

  it("renders batch cards when the batches tab is in the URL", async () => {
    getWorkloads.mockResolvedValue({
      metrics: {active: 9, queued: 4},
      filters: {statuses: ["active", "queued"], locations: [{id: "ikeja", label: "Ikeja"}]},
      batches: {
        items: [
          {
            id: "BTC-2301",
            tags: ["active"],
            sme: "Kuda Bank",
            createdAt: new Date().toISOString(),
            city: "Ikeja",
            totalValue: 336000,
            parcelCount: 840,
            delivered: 170,
            breakdown: [
              {key: "delivered", count: 170},
              {key: "in_transit", count: 56},
            ],
          },
        ],
        page: 1,
        pageSize: 5,
        total: 43,
      },
    });
    renderRoute(WorkloadsPage, "/workloads", "/workloads?tab=batches");

    expect(await screen.findByText("BTC-2301")).toBeTruthy();
    expect(screen.getByText("Kuda Bank", {exact: false})).toBeTruthy();
    expect(screen.getByText("workloads.batch_view_parcels")).toBeTruthy();
    expect(getWorkloads).toHaveBeenCalledWith(expect.objectContaining({tab: "batches"}));
  });

  it("shows the batch empty state when no batches match", async () => {
    getWorkloads.mockResolvedValue({
      metrics: {active: 0},
      filters: {statuses: [], locations: []},
      batches: {items: [], page: 1, pageSize: 5, total: 0},
    });
    renderRoute(WorkloadsPage, "/workloads", "/workloads?tab=batches");

    expect(await screen.findByText("workloads.batch_empty_title")).toBeTruthy();
    expect(screen.getByText("workloads.batch_empty_description")).toBeTruthy();
  });
});
