import {fireEvent, screen, waitFor} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {dashboardService} from "@/services/dashboard-service";
import {shipmentService} from "@/services/shipment-service";
import {renderRoute} from "@/test/render-route";
import type {DashboardOverview} from "@/types/dashboard-types";
import type {CreateBatchResult, Locker} from "@/types/shipment-types";
import {NewShipmentPage} from "../new-shipment";

vi.mock("@/services/shipment-service", () => ({
  shipmentService: {getLockers: vi.fn(), createBatch: vi.fn()},
}));
vi.mock("@/services/dashboard-service", () => ({
  dashboardService: {getOverview: vi.fn(), getNotifications: vi.fn(), markAllNotificationsRead: vi.fn()},
}));

const getLockers = vi.mocked(shipmentService.getLockers);
const createBatch = vi.mocked(shipmentService.createBatch);
const getOverview = vi.mocked(dashboardService.getOverview);

const LOCKERS: Locker[] = [
  {id: "locker-1", name: "Lekki Hub - PR14"},
  {id: "locker-2", name: "Surulere Hub - L04"},
];

const RESULT: CreateBatchResult = {
  batchId: "SH-20243",
  shipmentCount: 1,
  totalPaid: 1870,
  estimatedDelivery: "24–48h",
  receiptEmail: "ada@alvo.com",
};

function overviewWithBalance(walletBalance: number): DashboardOverview {
  return {
    firstName: "Ada",
    walletBalance,
    stats: {
      totalBatches: 0,
      activeBatches: 0,
      completeBatches: 0,
      draftBatches: 0,
      totalShipments: 0,
      topLocker: null,
      totalSpend: 0,
      avgPerShipment: 0,
      activeShipments: 0,
      activeShipmentBatches: 0,
      deliveredLast30Days: 0,
      pending: 0,
      failed: 0,
    },
    recentShipments: [],
  };
}

const renderPage = () => renderRoute(NewShipmentPage, "/new-shipment");
const payButton = () => screen.getByRole("button", {name: /batch\.order_pay/});
const nameInput = () => screen.getByLabelText("batch.col_recipient");
const phoneInput = () => screen.getByLabelText("batch.col_phone");

async function openForm() {
  renderPage();
  fireEvent.click(await screen.findByRole("button", {name: "batch.single_title"}));
  await screen.findByText("batch.col_recipient");
}

function fillRecipient() {
  fireEvent.change(nameInput(), {target: {value: "Khadija Rabiu"}});
  fireEvent.change(phoneInput(), {target: {value: "08034412210"}});
}

describe("NewShipmentPage", () => {
  beforeEach(() => {
    getLockers.mockReset().mockResolvedValue(LOCKERS);
    createBatch.mockReset().mockResolvedValue(RESULT);
    getOverview.mockReset().mockResolvedValue(overviewWithBalance(48500));
  });

  it("shows both shipment modes and enters the single-shipment form", async () => {
    renderPage();

    expect(await screen.findByRole("button", {name: "batch.bulk_title"})).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "batch.single_title"}));

    expect(await screen.findByText("batch.col_recipient")).toBeTruthy();
    expect(screen.getByRole("button", {name: "batch.add_recipient"})).toBeTruthy();
  });

  it("flags empty recipient fields when paying without filling the form", async () => {
    await openForm();
    fireEvent.click(payButton());

    expect(nameInput().getAttribute("aria-invalid")).toBe("true");
    expect(phoneInput().getAttribute("aria-invalid")).toBe("true");
    expect(screen.queryByText("pay.title")).toBeNull();
  });

  it("adds and removes recipient rows", async () => {
    await openForm();
    fireEvent.click(screen.getByRole("button", {name: "batch.add_recipient"}));

    const removeButtons = screen.getAllByRole("button", {name: "batch.remove_recipient"});
    expect(removeButtons).toHaveLength(2);

    fireEvent.click(removeButtons[0]);
    expect(screen.getAllByRole("button", {name: "batch.remove_recipient"})).toHaveLength(1);
  });

  it("pays from the wallet and lands on the success screen", async () => {
    await openForm();
    fillRecipient();
    fireEvent.click(payButton());

    expect(await screen.findByText("pay.title")).toBeTruthy();
    await waitFor(() => expect(screen.getByRole("radio", {name: /pay\.wallet/}).getAttribute("aria-checked")).toBe("true"));
    fireEvent.click(screen.getByRole("button", {name: "pay.pay"}));

    expect(await screen.findByText("success.title")).toBeTruthy();
    expect(screen.getByText("success.shipment_id")).toBeTruthy();
    expect(screen.getByText("₦1,870")).toBeTruthy();
    expect(createBatch).toHaveBeenCalledWith(
      expect.objectContaining({method: "wallet", recipients: [expect.objectContaining({name: "Khadija Rabiu"})]}),
      expect.anything()
    );
  });

  it("shows the insufficient-balance strip and disables pay when the wallet is short", async () => {
    getOverview.mockResolvedValue(overviewWithBalance(0));
    await openForm();
    fillRecipient();
    fireEvent.click(payButton());

    expect(await screen.findByText("pay.insufficient")).toBeTruthy();
    expect(screen.getByRole("link", {name: "pay.topup"}).getAttribute("href")).toBe("/wallet");
    expect(screen.getByRole("button", {name: "pay.pay"})).toHaveProperty("disabled", true);
  });

  it("routes online payments through the gateway before succeeding", async () => {
    await openForm();
    fillRecipient();
    fireEvent.click(payButton());

    fireEvent.click(await screen.findByRole("radio", {name: /pay\.online/}));
    fireEvent.click(screen.getByRole("button", {name: "pay.pay"}));

    expect(await screen.findByText("pay.gateway_caption")).toBeTruthy();
    expect(await screen.findByText("success.title", {}, {timeout: 4000})).toBeTruthy();
    expect(createBatch).toHaveBeenCalledWith(expect.objectContaining({method: "online"}), expect.anything());
  });

  it("resets to mode select when creating another shipment", async () => {
    await openForm();
    fillRecipient();
    fireEvent.click(payButton());
    fireEvent.click(await screen.findByRole("button", {name: "pay.pay"}));

    fireEvent.click(await screen.findByRole("button", {name: "success.create_another"}));
    expect(await screen.findByRole("button", {name: "batch.single_title"})).toBeTruthy();
  });
});
