import {fireEvent, screen, waitFor} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {workloadsService} from "@/services/workloads-service";
import {renderRoute} from "@/test/render-route";
import type {BatchDetail, Page, ParcelDetail, ParcelRow} from "@/types/workloads-types";
import {BatchDetailPage} from "../batch-detail";

vi.mock("@/services/workloads-service", () => ({
  workloadsService: {
    getWorkloads: vi.fn(),
    getBatchDetail: vi.fn(),
    getBatchParcels: vi.fn(),
    getParcelDetail: vi.fn(),
    flagParcels: vi.fn(),
    exportList: vi.fn(),
  },
}));

const getBatchDetail = vi.mocked(workloadsService.getBatchDetail);
const getBatchParcels = vi.mocked(workloadsService.getBatchParcels);
const getParcelDetail = vi.mocked(workloadsService.getParcelDetail);
const flagParcels = vi.mocked(workloadsService.flagParcels);

function detail(overrides: Partial<BatchDetail> = {}): BatchDetail {
  return {
    id: "BTC-2301",
    tags: ["active"],
    sme: "Kuda Bank",
    createdAt: "2026-03-14T09:00:00",
    city: "Ikeja, Lagos",
    totalValue: 336000,
    parcelCount: 840,
    delivered: 170,
    metrics: {processing: 24, in_transit: 56, delivered: 170},
    filters: {statuses: ["in_transit", "delivered"], locations: [{id: "ikeja", label: "Ikeja"}]},
    ...overrides,
  };
}

function parcels(overrides: Partial<Page<ParcelRow>> = {}): Page<ParcelRow> {
  return {
    items: [
      {
        id: "PRV-88301",
        sender: "Kuda Bank",
        recipient: "Dayo Ogunsanya",
        destination: "Lekki, Lagos (LK-015)",
        courierId: "PRG-023",
        lastNodeId: "LK-022",
        status: "in_transit",
        slaRemainingMin: 182,
        flagged: false,
      },
    ],
    page: 1,
    pageSize: 10,
    total: 840,
    ...overrides,
  };
}

function parcelDetail(overrides: Partial<ParcelDetail> = {}): ParcelDetail {
  return {
    id: "PRV-88301",
    serviceType: "standard",
    status: "in_transit",
    flag: null,
    sender: "Kuda Bank",
    recipient: "Dayo Ogunsanya",
    courier: {id: "PRG-023", name: "Ajadi Johnson"},
    route: {from: "Ikeja (IK-023)", to: "Lekki (LK-015)"},
    size: "Small - 1.8kg",
    charged: 1450,
    slaRemainingMin: 182,
    routes: [
      {label: "1st Route Timeline", steps: [{key: "created", at: "2026-03-16T08:02:00"}, {key: "dropped_at_node"}]},
      {label: "2nd Route Timeline", steps: [{key: "created"}, {key: "delivered"}]},
    ],
    ...overrides,
  };
}

function renderPage() {
  return renderRoute(() => <BatchDetailPage batchId="BTC-2301" />, "/workloads/batches/$batchId", "/workloads/batches/BTC-2301");
}

describe("BatchDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getBatchDetail.mockResolvedValue(detail());
    getBatchParcels.mockResolvedValue(parcels());
    getParcelDetail.mockResolvedValue(parcelDetail());
    flagParcels.mockResolvedValue({flagged: 1});
  });

  it("shows the skeleton while the batch loads", async () => {
    getBatchDetail.mockReturnValue(new Promise(() => {}));
    renderPage();
    await waitFor(() => expect(document.querySelector("[aria-busy='true']")).toBeTruthy());
  });

  it("renders the header, metrics and parcel table", async () => {
    renderPage();

    expect(await screen.findAllByText("BTC-2301")).not.toHaveLength(0);
    expect(screen.getByText("Kuda Bank", {exact: false})).toBeTruthy();
    expect(await screen.findByText("PRV-88301")).toBeTruthy();
    expect(getBatchDetail).toHaveBeenCalledWith("BTC-2301");
    expect(getBatchParcels).toHaveBeenCalledWith("BTC-2301", expect.objectContaining({page: 1}));
  });

  it("shows the error state when the batch fails to load", async () => {
    getBatchDetail.mockRejectedValue(new Error("down"));
    renderPage();

    expect(await screen.findByText("workloads.load_error_title")).toBeTruthy();
  });

  it("opens the parcel drawer with both route timelines", async () => {
    renderPage();
    fireEvent.click(await screen.findByText("PRV-88301"));

    expect(await screen.findByText("1st Route Timeline")).toBeTruthy();
    expect(screen.getByText("2nd Route Timeline")).toBeTruthy();
    expect(getParcelDetail).toHaveBeenCalledWith("PRV-88301");
  });

  it("flags a batch parcel through the shared modal and shows the toast", async () => {
    renderPage();
    fireEvent.click(await screen.findByText("PRV-88301"));
    fireEvent.click(await screen.findByRole("button", {name: "workloads.flag_for_review"}));

    fireEvent.change(screen.getByRole("combobox"), {target: {value: "damaged_item"}});
    fireEvent.click(screen.getByRole("button", {name: "workloads.flag_confirm"}));

    expect(await screen.findByRole("status")).toBeTruthy();
    expect(flagParcels).toHaveBeenCalledWith({ids: ["PRV-88301"], reason: "damaged_item", notes: undefined});
  });
});
