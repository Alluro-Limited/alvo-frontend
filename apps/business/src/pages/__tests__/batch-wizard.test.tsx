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
  batchId: "BT-20243",
  shipmentCount: 2,
  totalPaid: 1030,
  estimatedDelivery: "24–48h",
  receiptEmail: "ada@alvo.com",
};

const CSV = [
  "name,phone,locker_id,parcel_size,priority",
  "Khadija Rabiu,08034412210,locker-1,M,express",
  "Bad Phone,123,locker-1,S,standard",
  "Ghost Locker,08034412210,lk-99,S,standard",
].join("\n");

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

async function openWizard() {
  renderRoute(NewShipmentPage, "/new-shipment");
  fireEvent.click(await screen.findByRole("button", {name: "batch.bulk_title"}));
  await screen.findByText("wiz.batch_name");
}

async function toStepTwo() {
  await openWizard();
  fireEvent.change(screen.getByLabelText("wiz.batch_name"), {target: {value: "March restock"}});
  fireEvent.click(screen.getByRole("button", {name: "wiz.next_shipments"}));
  await screen.findByText("wiz.add_sub");
}

function uploadCsv(contents: string = CSV) {
  const file = new File([contents], "shipments.csv", {type: "text/csv"});
  fireEvent.change(screen.getByLabelText("wiz.tab_csv"), {target: {files: [file]}});
}

async function toReview() {
  await toStepTwo();
  uploadCsv();
  await screen.findByText("wiz.csv_ok", {}, {timeout: 4000});
  fireEvent.click(screen.getByRole("button", {name: "wiz.next_review"}));
  await screen.findByText("wiz.review_title");
}

async function toConfirm() {
  await toReview();
  fireEvent.click(screen.getByRole("button", {name: /wiz\.proceed/}));
  await screen.findByText("wiz.pay_title");
}

describe("NewShipmentPage — bulk batch wizard", () => {
  beforeEach(() => {
    getLockers.mockReset().mockResolvedValue(LOCKERS);
    createBatch.mockReset().mockResolvedValue(RESULT);
    getOverview.mockReset().mockResolvedValue(overviewWithBalance(48500));
  });

  it("enters the wizard and requires a batch name before step 2", async () => {
    await openWizard();

    expect(screen.getByText("wiz.step1_d")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "wiz.next_shipments"}));
    expect(await screen.findByText("wiz.name_required")).toBeTruthy();

    fireEvent.change(screen.getByLabelText("wiz.batch_name"), {target: {value: "March restock"}});
    fireEvent.click(screen.getByRole("button", {name: "wiz.next_shipments"}));
    expect(await screen.findByText("wiz.add_sub")).toBeTruthy();
  });

  it("parses an uploaded CSV and shows per-row validation banners", async () => {
    await toStepTwo();
    uploadCsv();

    expect(await screen.findByText("wiz.csv_ok", {}, {timeout: 4000})).toBeTruthy();
    expect(screen.getByText("wiz.err_locker")).toBeTruthy();
    expect(screen.getByText("wiz.err_phone")).toBeTruthy();
    expect(screen.getByText("shipments.csv")).toBeTruthy();
  });

  it("flags bad rows in review and proceeds with the valid ones only", async () => {
    await toReview();

    expect(screen.getByText("wiz.review_warn")).toBeTruthy();
    expect(screen.getByText("Khadija Rabiu")).toBeTruthy();
    expect(screen.getAllByRole("button", {name: /wiz\.review_resolve/})).toHaveLength(2);
    expect(screen.getByRole("button", {name: /wiz\.proceed/})).toBeTruthy();
  });

  it("sends Resolve back to the manual entry tab", async () => {
    await toReview();
    fireEvent.click(screen.getAllByRole("button", {name: /wiz\.review_resolve/})[0]);

    expect(await screen.findByRole("tab", {name: "wiz.tab_manual"})).toBeTruthy();
    expect(screen.getAllByLabelText("batch.col_recipient").length).toBeGreaterThan(0);
  });

  it("submits the batch with wallet payment and shows the success screen", async () => {
    await toConfirm();

    expect(screen.getByText("wiz.order")).toBeTruthy();
    expect(screen.getByText("wiz.next_happens")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: /wiz\.submit/}));

    expect(await screen.findByText("wiz.done_title")).toBeTruthy();
    expect(screen.getByText("wiz.batch_id")).toBeTruthy();
    expect(createBatch).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "wallet",
        name: "March restock",
        originLockerId: "locker-1",
        recipients: [expect.objectContaining({name: "Khadija Rabiu"})],
      }),
      expect.anything()
    );
  });

  it("blocks submission when the wallet cannot cover the batch", async () => {
    getOverview.mockResolvedValue(overviewWithBalance(0));
    await toConfirm();

    expect(screen.getByText("wiz.wallet_balance")).toBeTruthy();
    expect(screen.getByRole("button", {name: /wiz\.submit/})).toHaveProperty("disabled", true);
    fireEvent.click(screen.getByRole("radio", {name: /pay\.online/}));
    expect(screen.getByRole("button", {name: /wiz\.submit/})).toHaveProperty("disabled", false);
  });

  it("navigates back through the steps", async () => {
    await toStepTwo();
    fireEvent.click(screen.getByRole("button", {name: "wiz.back"}));

    expect(await screen.findByLabelText("wiz.batch_name")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "wiz.back"}));
    expect(await screen.findByRole("button", {name: "batch.single_title"})).toBeTruthy();
  });

  it("adds recipients manually when no file is uploaded", async () => {
    await toStepTwo();
    fireEvent.click(screen.getByRole("tab", {name: "wiz.tab_manual"}));

    fireEvent.click(await screen.findByRole("button", {name: "batch.add_recipient"}));
    const names = screen.getAllByLabelText("batch.col_recipient");
    fireEvent.change(names[0], {target: {value: "Ada Obi"}});
    fireEvent.change(screen.getAllByLabelText("batch.col_phone")[0], {target: {value: "08034412210"}});

    fireEvent.click(screen.getByRole("button", {name: "wiz.next_review"}));
    expect(await screen.findByText("wiz.review_title")).toBeTruthy();
    expect(screen.getByText("Ada Obi")).toBeTruthy();
  });

  it("shows a header error for a file without the required columns", async () => {
    await toStepTwo();
    uploadCsv("foo,bar\n1,2");

    expect(await screen.findByText("wiz.err_header", {}, {timeout: 4000})).toBeTruthy();
    expect(screen.getByRole("button", {name: "wiz.next_review"})).toHaveProperty("disabled", true);
  });
});
