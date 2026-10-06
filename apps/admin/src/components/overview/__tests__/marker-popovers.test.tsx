import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {fireEvent, render, screen} from "@testing-library/react";
import type {ReactElement} from "react";
import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {dashboardService} from "@/services/dashboard-service";
import {COURIER_DETAILS, NODE_DETAILS} from "@/services/mocks/mock-overview-data";
import {CourierPopover} from "../courier-popover";
import {NodePopover} from "../node-popover";

vi.mock("@/services/dashboard-service", () => ({
  dashboardService: {getOverview: vi.fn(), getNodeDetail: vi.fn(), getCourierDetail: vi.fn()},
}));

const getNodeDetail = vi.mocked(dashboardService.getNodeDetail);
const getCourierDetail = vi.mocked(dashboardService.getCourierDetail);

function renderPopover(ui: ReactElement) {
  const queryClient = new QueryClient({defaultOptions: {queries: {retry: false}}});
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

describe("NodePopover", () => {
  beforeEach(() => {
    getNodeDetail.mockReset();
  });

  it("shows a skeleton while the detail loads", () => {
    getNodeDetail.mockReturnValue(new Promise(() => {}));
    renderPopover(<NodePopover id="LK-022" onClose={vi.fn()} />);

    expect(screen.getByRole("status")).toBeTruthy();
    expect(getNodeDetail).toHaveBeenCalledWith("LK-022");
  });

  it("renders the node's health and capacity once loaded", async () => {
    getNodeDetail.mockResolvedValue(NODE_DETAILS["LK-022"]);
    renderPopover(<NodePopover id="LK-022" onClose={vi.fn()} />);

    await screen.findByText("LK-022");
    expect(screen.getByText("Victoria Island, Lagos")).toBeTruthy();
    expect(screen.getByText("overview.status.online")).toBeTruthy();
    expect(screen.getByText("overview.node.capacity")).toBeTruthy();
    expect(screen.getByText("Total Energies, VI")).toBeTruthy();
    expect(screen.getByText("99.8%")).toBeTruthy();
    expect(screen.getByText("4G LTE")).toBeTruthy();
  });

  it("closes through its close button", async () => {
    const onClose = vi.fn();
    getNodeDetail.mockResolvedValue(NODE_DETAILS["LK-022"]);
    renderPopover(<NodePopover id="LK-022" onClose={onClose} />);

    await screen.findByText("LK-022");
    fireEvent.click(screen.getByRole("button", {name: "overview.popover.close"}));
    expect(onClose).toHaveBeenCalled();
  });

  it("shows the error state and retries", async () => {
    getNodeDetail.mockRejectedValueOnce(new Error("down")).mockResolvedValue(NODE_DETAILS["LK-022"]);
    renderPopover(<NodePopover id="LK-022" onClose={vi.fn()} />);

    expect(await screen.findByRole("alert")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "overview.retry"}));
    expect(await screen.findByText("LK-022")).toBeTruthy();
  });
});

describe("CourierPopover", () => {
  beforeEach(() => {
    getCourierDetail.mockReset();
  });

  it("renders the courier header and deliveries progress once loaded", async () => {
    getCourierDetail.mockResolvedValue(COURIER_DETAILS["PRG-03"]);
    renderPopover(<CourierPopover id="PRG-03" onClose={vi.fn()} />);

    await screen.findByText("Ajadi Johnson");
    expect(screen.getByText("PRG-03")).toBeTruthy();
    expect(screen.getByText("overview.status.enroute")).toBeTruthy();
    expect(screen.getByText("overview.courier.todays_deliveries")).toBeTruthy();
    expect(getCourierDetail).toHaveBeenCalledWith("PRG-03");
  });

  it("expands the trip details on Show", async () => {
    getCourierDetail.mockResolvedValue(COURIER_DETAILS["PRG-03"]);
    renderPopover(<CourierPopover id="PRG-03" onClose={vi.fn()} />);

    await screen.findByText("Ajadi Johnson");
    expect(screen.queryByText("Lekki Node (LK-123)")).toBeNull();

    fireEvent.click(screen.getByRole("button", {name: /overview.courier.details/}));
    expect(screen.getByText("Lekki Node (LK-123)")).toBeTruthy();
    expect(screen.getByText("Super Node (SN-001)")).toBeTruthy();
    expect(screen.getByText("5:30PM")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", {name: /overview.courier.details/}));
    expect(screen.queryByText("Lekki Node (LK-123)")).toBeNull();
  });
});
