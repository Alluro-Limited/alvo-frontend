import {fireEvent, screen, waitFor} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {deliveryService} from "@/services/delivery-service";
import {renderRoute} from "@/test/render-route";
import type {DeliveryDetail} from "@/types/delivery-types";
import {DeliveryPage} from "../delivery";
import {PackageListPage} from "../package-list";

vi.mock("@/services/delivery-service", () => ({
  deliveryService: {getDelivery: vi.fn(), scanNextPackage: vi.fn(), scanPackage: vi.fn(), updateStatus: vi.fn()},
}));

const getDelivery = vi.mocked(deliveryService.getDelivery);
const scanNext = vi.mocked(deliveryService.scanNextPackage);
const scanPackage = vi.mocked(deliveryService.scanPackage);
const updateStatus = vi.mocked(deliveryService.updateStatus);

function delivery(overrides: Partial<DeliveryDetail> = {}): DeliveryDetail {
  return {
    id: "PRI-4728123780",
    kind: "regular",
    dateLabel: "24 June, 2024 | 08:45 AM",
    accessCode: "847215",
    stops: [
      {label: "Locker #1", address: "B2/128 Alh. Olatunji Srt, Lekki Phase 1", kind: "pickup"},
      {label: "Drop Zone - Locker #IKJ03", address: "First Bank, Lekki Phase 1", kind: "dropoff"},
    ],
    distanceKm: 3.4,
    manifestTotal: 9,
    packages: [
      {code: "PKG-001-2024", name: "Document Envelope", weight: "1.5Kg", scanned: false},
      {code: "PKG-002-2024", name: "Business Report", weight: "2.0Kg", scanned: false},
    ],
    status: "assigned",
    timeline: [{label: "Assigned", at: "20 Dec, 9:45 AM"}],
    payout: 3200,
    ...overrides,
  };
}

describe("DeliveryPage", () => {
  beforeEach(() => {
    getDelivery.mockReset().mockResolvedValue(delivery());
    scanNext.mockReset().mockResolvedValue(delivery());
    scanPackage.mockReset().mockResolvedValue(delivery());
    updateStatus.mockReset().mockResolvedValue(delivery());
  });

  it("shows the locker access card and route on the overview tab", async () => {
    renderRoute(() => <DeliveryPage jobId="PRI-4728123780" />, "/deliveries/PRI-4728123780");
    expect(await screen.findByText("PRI-4728123780")).toBeTruthy();
    expect(screen.getByText("Drop Zone - Locker #IKJ03")).toBeTruthy();
    expect(screen.getByText("job.locker_hint")).toBeTruthy();
    expect(screen.getByText("Locker #1")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "job.reveal"}));
    expect(screen.getByText(/8 4 7 2 1 5/)).toBeTruthy();
  });

  it("scans the next package and updates the tab count", async () => {
    const scanned = delivery({packages: [{code: "PKG-001-2024", name: "Doc", weight: "1.5Kg", scanned: true}]});
    scanNext.mockResolvedValue(scanned);
    renderRoute(() => <DeliveryPage jobId="PRI-4728123780" />, "/deliveries/PRI-4728123780");
    fireEvent.click(await screen.findByRole("button", {name: /job\.packages/}));
    fireEvent.click(screen.getByRole("button", {name: "job.tap_scan"}));
    await waitFor(() => expect(scanNext).toHaveBeenCalledWith("PRI-4728123780"));
  });

  it("reports not-found and already-scanned on manual entry", async () => {
    renderRoute(() => <DeliveryPage jobId="PRI-4728123780" />, "/deliveries/PRI-4728123780");
    fireEvent.click(await screen.findByRole("button", {name: /job\.packages/}));
    fireEvent.change(screen.getByLabelText("job.code_placeholder"), {target: {value: "PKG-404"}});
    fireEvent.click(screen.getByRole("button", {name: "job.submit_code"}));
    await waitFor(() => expect(scanPackage).toHaveBeenCalledWith("PRI-4728123780", "PKG-404"));
  });

  it("confirms dropped off and shows the completion sheet", async () => {
    renderRoute(() => <DeliveryPage jobId="PRI-4728123780" />, "/deliveries/PRI-4728123780");
    fireEvent.click(await screen.findByRole("button", {name: "job.status"}));
    fireEvent.click(screen.getByRole("button", {name: /job\.st_dropped /}));
    fireEvent.click(screen.getByRole("button", {name: "job.confirm_status"}));
    await waitFor(() => expect(updateStatus).toHaveBeenCalledWith("PRI-4728123780", "dropped_off"));
    expect(await screen.findByText("job.done_title")).toBeTruthy();
    expect(screen.getByText("job.fixed_pay")).toBeTruthy();
  });
});

describe("PackageListPage", () => {
  it("lists every manifest package with its status", async () => {
    getDelivery.mockResolvedValue(delivery());
    renderRoute(() => <PackageListPage jobId="PRI-4728123780" />, "/deliveries/PRI-4728123780/packages");
    expect(await screen.findByText("job.package_list")).toBeTruthy();
    expect(await screen.findByText("PKG-001-2024")).toBeTruthy();
    expect(screen.getAllByText("job.pending_pkg").length).toBeGreaterThan(0);
  });
});
