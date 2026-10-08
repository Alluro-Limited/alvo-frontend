import {fireEvent, screen, waitFor, within} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {payoutsService} from "@/services/payouts-service";
import {renderRoute} from "@/test/render-route";
import type {PayoutDeliveriesResponse, PayoutDetail, PayoutListResponse, PayoutRow} from "@/types/payouts-types";
import {CourierPayoutsPage} from "../courier-payouts";

vi.mock("@/services/payouts-service", () => ({
  payoutsService: {
    getPayouts: vi.fn(),
    getPayoutDetail: vi.fn(),
    getPayoutDeliveries: vi.fn(),
    markPayoutsPaid: vi.fn(),
    withholdPayout: vi.fn(),
    flagPayout: vi.fn(),
    exportPayouts: vi.fn(),
  },
}));

const getPayouts = vi.mocked(payoutsService.getPayouts);
const getPayoutDetail = vi.mocked(payoutsService.getPayoutDetail);
const getPayoutDeliveries = vi.mocked(payoutsService.getPayoutDeliveries);
const markPayoutsPaid = vi.mocked(payoutsService.markPayoutsPaid);
const withholdPayout = vi.mocked(payoutsService.withholdPayout);
const flagPayout = vi.mocked(payoutsService.flagPayout);
const exportPayouts = vi.mocked(payoutsService.exportPayouts);

const ROWS: PayoutRow[] = [
  {
    courierId: "PRG-0215",
    name: "John Soyinka",
    photoUrl: null,
    accountNumber: "5829304716",
    bankName: "Unity Bank",
    deliveries: 11,
    netPayout: 23_470,
    status: "withheld",
  },
  {
    courierId: "PRG-0311",
    name: "Ada Nwosu",
    photoUrl: null,
    accountNumber: "2093847561",
    bankName: "GTBank",
    deliveries: 42,
    netPayout: 18_900,
    status: "not_paid",
  },
  {
    courierId: "PRG-0440",
    name: "Tunde Bello",
    photoUrl: null,
    accountNumber: "1029384756",
    bankName: "Access Bank",
    deliveries: 67,
    netPayout: 30_150,
    status: "paid",
  },
];

const DETAIL: PayoutDetail = {
  courierId: "PRG-0311",
  name: "Ada Nwosu",
  photoUrl: null,
  status: "not_paid",
  deliveriesCompleted: 42,
  grossEarnings: 20_150,
  netPayout: 18_900,
  bank: {bankName: "GTBank", accountNumber: "2093847561", accountHolder: "Ada Nwosu"},
  disputes: [],
  paidAt: null,
};

const LIST: PayoutListResponse = {
  metrics: {
    totalPayout: 4_150_000,
    courierCount: 10,
    paidAmount: 3_200_000,
    paidCouriers: 2,
    notPaidAmount: 955_000,
    awaitingTransfer: 3,
    withheldAmount: 42_650,
    withheldCouriers: 3,
    withheldIssues: 4,
  },
  payouts: {items: ROWS, page: 1, pageSize: 10, total: 3},
  withheld: {
    unresolvedCount: 4,
    heldAmount: 42_650,
    items: [{id: "DSP-1", courierId: "PRG-0215", courierName: "John Soyinka", issueCount: 1, issueLabel: "Damaged", amount: 23_470}],
  },
  flagged: {
    unresolvedCount: 2,
    heldAmount: 12_400,
    items: [{id: "DSP-2", courierId: "PRG-0440", courierName: "Tunde Bello", issueCount: 1, issueLabel: "Underpaid", amount: 12_400}],
  },
  cycles: [
    {id: "2026-06B", label: "June 16 - 30, 2026"},
    {id: "2026-06A", label: "June 1 - 15, 2026"},
  ],
  filters: {statuses: ["paid", "not_paid", "withheld", "flagged"]},
  issueTypes: ["damaged", "lost", "delayed"],
  disputeReasons: ["underpaid", "incorrect_amount"],
  paymentMethods: ["bank_transfer", "manual"],
};

const DELIVERIES: PayoutDeliveriesResponse = {
  deliveries: {
    items: [
      {
        date: "2026-06-20",
        id: "ASN-1089",
        type: "express",
        pickup: "Lekki",
        dropoff: "VI",
        earned: 1_500,
        items: 3,
        status: "completed",
      },
    ],
    page: 1,
    pageSize: 10,
    total: 1,
  },
  totalEarned: 18_900,
};

beforeEach(() => {
  vi.clearAllMocks();
  getPayouts.mockResolvedValue(LIST);
  getPayoutDetail.mockResolvedValue(DETAIL);
  getPayoutDeliveries.mockResolvedValue(DELIVERIES);
  markPayoutsPaid.mockResolvedValue({ids: [], status: "paid"});
  withholdPayout.mockResolvedValue({id: "PRG-0311", status: "withheld"});
  flagPayout.mockResolvedValue({id: "PRG-0311", status: "flagged"});
  exportPayouts.mockResolvedValue("csv");
});

describe("CourierPayoutsPage", () => {
  it("renders the KPI grid, issue cards, and the payout table", async () => {
    renderRoute(CourierPayoutsPage, "/courier-payouts");
    expect(await screen.findByTestId("payout-kpi-grid")).toBeTruthy();
    expect(screen.getAllByText("payout.kpi_total")).toHaveLength(1);
    expect(screen.getAllByText("John Soyinka").length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText("₦23,470")).toBeTruthy();
    expect(screen.getByText("payout.withheld_title")).toBeTruthy();
    expect(screen.getByText("payout.flagged_title")).toBeTruthy();
    expect(screen.getAllByText("payout.status_withheld")).not.toHaveLength(0);
  });

  it("refetches when the status filter and search change", async () => {
    renderRoute(CourierPayoutsPage, "/courier-payouts");
    await screen.findByTestId("payout-kpi-grid");
    fireEvent.change(screen.getByRole("combobox", {name: "payout.col_status"}), {target: {value: "withheld"}});
    await waitFor(() => expect(getPayouts).toHaveBeenCalledWith(expect.objectContaining({status: "withheld"})));
    fireEvent.change(screen.getByPlaceholderText("payout.search_placeholder"), {target: {value: "ada"}});
    await waitFor(() => expect(getPayouts).toHaveBeenCalledWith(expect.objectContaining({query: "ada"})));
  });

  it("refetches when the cycle changes", async () => {
    renderRoute(CourierPayoutsPage, "/courier-payouts");
    await screen.findByTestId("payout-kpi-grid");
    fireEvent.change(screen.getByRole("combobox", {name: "payout.cycle_aria"}), {target: {value: "2026-06A"}});
    await waitFor(() => expect(getPayouts).toHaveBeenCalledWith(expect.objectContaining({cycle: "2026-06A"})));
  });

  it("shows the filtered-empty state with a clear-filter button", async () => {
    getPayouts.mockResolvedValue({...LIST, payouts: {items: [], page: 1, pageSize: 10, total: 0}});
    renderRoute(CourierPayoutsPage, "/courier-payouts");
    await screen.findByTestId("payout-kpi-grid");
    fireEvent.change(screen.getByPlaceholderText("payout.search_placeholder"), {target: {value: "zzzz"}});
    expect(await screen.findByTestId("payouts-filtered-empty")).toBeTruthy();
  });

  it("shows the page empty state when no couriers exist", async () => {
    getPayouts.mockResolvedValue({...LIST, payouts: {items: [], page: 1, pageSize: 10, total: 0}});
    renderRoute(CourierPayoutsPage, "/courier-payouts");
    expect(await screen.findByTestId("payouts-empty")).toBeTruthy();
  });

  it("shows an error card and retries the failed request", async () => {
    getPayouts.mockRejectedValueOnce(new Error("boom"));
    renderRoute(CourierPayoutsPage, "/courier-payouts");
    expect(await screen.findByTestId("payouts-error")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "payout.retry"}));
    await waitFor(() => expect(getPayouts).toHaveBeenCalledTimes(2));
  });

  it("checks a row into the selection bar and confirms the batch payout", async () => {
    renderRoute(CourierPayoutsPage, "/courier-payouts");
    await screen.findByText("Ada Nwosu");
    fireEvent.click(screen.getByRole("checkbox", {name: "PRG-0311"}));
    const bar = screen.getByRole("toolbar");
    fireEvent.click(within(bar).getByRole("button", {name: /payout\.mark_paid/}));
    expect(await screen.findByText("payout.batch_title")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: /payout\.batch_confirm/}));
    await waitFor(() => expect(markPayoutsPaid).toHaveBeenCalledWith(expect.objectContaining({courierIds: ["PRG-0311"]})));
    await waitFor(() => expect(screen.queryByRole("toolbar")).toBeNull());
  });

  it("opens the drawer and runs the single mark-as-paid flow", async () => {
    renderRoute(CourierPayoutsPage, "/courier-payouts");
    const row = (await screen.findByText("Ada Nwosu")).closest("tr")!;
    fireEvent.click(row);
    expect(await screen.findByText("payout.earnings_title")).toBeTruthy();
    expect(screen.getByText("payout.bank_title")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: /payout\.mark_paid$/}));
    expect(await screen.findByText("payout.mark_paid_title")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: /payout\.mark_paid_confirm/}));
    await waitFor(() => expect(markPayoutsPaid).toHaveBeenCalledWith(expect.objectContaining({courierIds: ["PRG-0311"]})));
  });

  it("opens the withhold dialog from the drawer and submits the issue", async () => {
    renderRoute(CourierPayoutsPage, "/courier-payouts");
    const row = (await screen.findByText("Ada Nwosu")).closest("tr")!;
    fireEvent.click(row);
    await screen.findByText("payout.earnings_title");
    fireEvent.click(screen.getByRole("button", {name: "payout.withhold"}));
    expect(await screen.findByText("payout.withhold_title")).toBeTruthy();
    fireEvent.change(screen.getByPlaceholderText("payout.withhold_parcel_placeholder"), {target: {value: "PRC-1234"}});
    fireEvent.change(screen.getByRole("combobox", {name: "payout.withhold_issue_label"}), {target: {value: "damaged"}});
    fireEvent.change(screen.getByPlaceholderText("payout.withhold_amount_placeholder"), {target: {value: "12000"}});
    fireEvent.change(screen.getByPlaceholderText("payout.withhold_description_placeholder"), {target: {value: "Crushed box."}});
    fireEvent.click(screen.getByRole("button", {name: "payout.withhold_confirm"}));
    await waitFor(() =>
      expect(withholdPayout).toHaveBeenCalledWith(
        "PRG-0311",
        expect.objectContaining({parcelId: "PRC-1234", issueType: "damaged", amountAtRisk: 12_000})
      )
    );
  });

  it("opens the flag dialog from the drawer and submits a dispute", async () => {
    renderRoute(CourierPayoutsPage, "/courier-payouts");
    const row = (await screen.findByText("Ada Nwosu")).closest("tr")!;
    fireEvent.click(row);
    await screen.findByText("payout.earnings_title");
    fireEvent.click(screen.getByRole("button", {name: "payout.flag"}));
    expect(await screen.findByText("payout.flag_title")).toBeTruthy();
    fireEvent.change(screen.getByRole("combobox", {name: "payout.flag_reason_label"}), {target: {value: "underpaid"}});
    fireEvent.change(screen.getByPlaceholderText("payout.flag_details_placeholder"), {target: {value: "Short ₦2,000"}});
    fireEvent.click(screen.getByRole("button", {name: "payout.flag_confirm"}));
    await waitFor(() => expect(flagPayout).toHaveBeenCalledWith("PRG-0311", expect.objectContaining({disputeReason: "underpaid"})));
  });

  it("opens the deliveries modal with rows and the earned total", async () => {
    renderRoute(CourierPayoutsPage, "/courier-payouts");
    const row = (await screen.findByText("Ada Nwosu")).closest("tr")!;
    fireEvent.click(row);
    await screen.findByText("payout.earnings_title");
    fireEvent.click(screen.getByRole("button", {name: "payout.view_deliveries"}));
    expect(await screen.findByText("ASN-1089")).toBeTruthy();
    expect(screen.getAllByText("₦18,900").length).toBeGreaterThanOrEqual(2);
    expect(getPayoutDeliveries).toHaveBeenCalledWith("PRG-0311", "2026-06B", expect.objectContaining({page: 1}));
  });

  it("filters the issue card to a status through View all", async () => {
    renderRoute(CourierPayoutsPage, "/courier-payouts");
    await screen.findByText("payout.withheld_title");
    const buttons = screen.getAllByText("payout.view_all");
    fireEvent.click(buttons[0]);
    await waitFor(() => expect(getPayouts).toHaveBeenCalledWith(expect.objectContaining({status: "withheld"})));
  });
});
