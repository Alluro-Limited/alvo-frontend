import {fireEvent, screen, waitFor} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {smesService} from "@/services/smes-service";
import {renderRoute} from "@/test/render-route";
import type {SmeDetail, SmeListResponse, SmeRow} from "@/types/smes-types";
import {SmesPage} from "../smes";

vi.mock("@/services/smes-service", () => ({
  smesService: {
    getSmes: vi.fn(),
    getSmeDetail: vi.fn(),
    updateSme: vi.fn(),
    approveVerificationItem: vi.fn(),
    suspendSme: vi.fn(),
    unsuspendSme: vi.fn(),
    flagSmes: vi.fn(),
    deactivateSme: vi.fn(),
    exportSmes: vi.fn(),
  },
}));

const getSmes = vi.mocked(smesService.getSmes);
const getSmeDetail = vi.mocked(smesService.getSmeDetail);
const updateSme = vi.mocked(smesService.updateSme);
const approveVerificationItem = vi.mocked(smesService.approveVerificationItem);
const suspendSme = vi.mocked(smesService.suspendSme);
const unsuspendSme = vi.mocked(smesService.unsuspendSme);
const flagSmes = vi.mocked(smesService.flagSmes);
const deactivateSme = vi.mocked(smesService.deactivateSme);

const ROW: SmeRow = {
  id: "PRV-1002",
  businessName: "Zuri Commerce Ltd",
  industry: "E-commerce",
  location: "Lekki, Lagos",
  verification: "verified",
  joinedAt: "2025-03-12T10:00:00Z",
  status: "active",
};

const SUSPENDED_ROW: SmeRow = {
  id: "PRV-0357",
  businessName: "Urban Pulse Media",
  industry: "Healthcare",
  location: "Surulere, Lagos",
  verification: "partial",
  joinedAt: "2026-06-05T10:48:00Z",
  status: "suspended",
};

const DETAIL: SmeDetail = {
  ...ROW,
  ref: "SME-001",
  businessType: "E-commerce",
  businessPhone: "0801 234 5678",
  businessEmail: "zuricom@gmail.com",
  contactName: "Adaeze Nwosu",
  contactEmail: "emakaokonkwo781@gmail.com",
  contactPhone: "0801 234 5678",
  cacNumber: "RC-1284756",
  verification: "verified",
  dvaEnabled: true,
  flag: null,
  suspension: null,
  walletBalanceKobo: 58_000_000,
  dvaAccount: "2004987824",
  bank: "Paystack",
  verificationItems: [
    {
      key: "cac_certificate",
      label: "CAC Certificate",
      status: "submitted",
      fileName: "cac_certificate.pdf",
      checklist: ["Document is a valid CAC certificate", "Business name matches the registered company name"],
    },
    {key: "public_search", label: "Public search", status: "submitted", fileName: null, checklist: ["Registry status is active"]},
  ],
  batches: [
    {id: "B-2280", parcels: 80, amountKobo: 10_250_000, createdAt: new Date().toISOString(), status: "active"},
    {id: "B-2281", parcels: 57, amountKobo: 11_020_000, createdAt: new Date().toISOString(), status: "completed"},
  ],
};

function list(overrides: Partial<SmeListResponse["smes"]> = {}): SmeListResponse {
  return {
    metrics: {total: 343, verified: 280, suspended: 12, flagged: 8, newToday: 21},
    filters: {statuses: ["active", "flagged", "suspended"], verifications: ["verified", "partial", "unverified"]},
    suspendReasons: ["fraudulent_bulk_uploads", "payment_default", "other"],
    deactivateReasons: ["customer_decision", "other"],
    businessTypes: ["E-commerce", "Healthcare"],
    smes: {items: [ROW, SUSPENDED_ROW], page: 1, pageSize: 10, total: 37, ...overrides},
  };
}

/** Renders the page, waits for the list, and opens Zuri's drawer. */
async function openDrawer() {
  renderRoute(SmesPage, "/smes");
  fireEvent.click(await screen.findByText("PRV-1002"));
  await waitFor(() => expect(getSmeDetail).toHaveBeenCalledWith("PRV-1002"));
  await screen.findByText("smes.business_info");
}

describe("SmesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getSmes.mockResolvedValue(list());
    getSmeDetail.mockResolvedValue(DETAIL);
  });

  it("shows the skeleton while SMEs load", async () => {
    getSmes.mockReturnValue(new Promise(() => {}));
    renderRoute(SmesPage, "/smes");
    await waitFor(() => expect(document.querySelector("[aria-busy='true']")).toBeTruthy());
  });

  it("renders metrics, the table and pagination once loaded", async () => {
    renderRoute(SmesPage, "/smes");

    expect(await screen.findByText("PRV-1002")).toBeTruthy();
    expect(screen.getByText("Zuri Commerce Ltd")).toBeTruthy();
    expect(screen.getByText("Urban Pulse Media")).toBeTruthy();
    expect(screen.getByText("smes.metric_total")).toBeTruthy();
    expect(screen.getByText("smes.metric_new_today")).toBeTruthy();
    expect(screen.getByText("workloads.showing")).toBeTruthy();
  });

  it("fetches with the search, status and verification filters", async () => {
    renderRoute(SmesPage, "/smes");
    await screen.findByText("PRV-1002");

    fireEvent.change(screen.getByPlaceholderText("smes.search_placeholder"), {target: {value: "PRV-99"}});
    await waitFor(() => expect(getSmes).toHaveBeenCalledWith(expect.objectContaining({query: "PRV-99", page: 1})));

    fireEvent.change(screen.getAllByRole("combobox")[0], {target: {value: "suspended"}});
    await waitFor(() => expect(getSmes).toHaveBeenCalledWith(expect.objectContaining({status: "suspended", page: 1})));

    fireEvent.change(screen.getAllByRole("combobox")[1], {target: {value: "partial"}});
    await waitFor(() => expect(getSmes).toHaveBeenCalledWith(expect.objectContaining({verification: "partial", page: 1})));
  });

  it("renders the first-run empty state", async () => {
    getSmes.mockResolvedValue(list({items: [], total: 0}));
    renderRoute(SmesPage, "/smes");

    expect(await screen.findByText("smes.empty_title")).toBeTruthy();
    expect(screen.getByText("smes.empty_description")).toBeTruthy();
  });

  it("renders the filtered-empty state and clears filters", async () => {
    getSmes.mockResolvedValue(list({items: [], total: 0}));
    renderRoute(SmesPage, "/smes");
    await screen.findByText("smes.empty_title");

    fireEvent.change(screen.getByPlaceholderText("smes.search_placeholder"), {target: {value: "zzz"}});
    expect(await screen.findByText("smes.filtered_empty_title")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "smes.clear_filter"}));
    await waitFor(() => expect(getSmes).toHaveBeenLastCalledWith(expect.objectContaining({query: undefined})));
  });

  it("shows the error state and retries", async () => {
    getSmes.mockRejectedValueOnce(new Error("down")).mockResolvedValue(list());
    renderRoute(SmesPage, "/smes");

    expect(await screen.findByText("workloads.load_error_title")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "workloads.retry"}));
    expect(await screen.findByText("PRV-1002")).toBeTruthy();
  });

  it("opens the drawer with the overview card, pills and batch history", async () => {
    await openDrawer();

    expect(screen.getAllByText("Zuri Commerce Ltd").length).toBeGreaterThan(0);
    expect(screen.getByText("smes.dva_enabled")).toBeTruthy();
    expect(screen.getByText("Adaeze Nwosu")).toBeTruthy();
    expect(screen.getByText("₦580,000")).toBeTruthy();

    fireEvent.click(screen.getByRole("tab", {name: "smes.tab_batches"}));
    expect(await screen.findByText("B-2280")).toBeTruthy();
  });

  it("shows the verification tab with the CAC number and reviewable items", async () => {
    await openDrawer();

    fireEvent.click(screen.getByRole("tab", {name: "smes.tab_verification"}));
    expect(await screen.findByText("RC-1284756")).toBeTruthy();
    expect(screen.getByText("CAC Certificate")).toBeTruthy();
    expect(screen.getAllByText("smes.verification_mark_approved").length).toBe(2);
  });

  it("edits account information through the modal", async () => {
    updateSme.mockResolvedValue({...DETAIL, businessName: "Zuri Commerce HQ"});
    await openDrawer();

    fireEvent.click(screen.getByRole("button", {name: /smes\.card_edit/}));
    expect(await screen.findByText("smes.edit_title")).toBeTruthy();

    fireEvent.change(document.getElementById("sme-edit-name")!, {target: {value: "Zuri Commerce HQ"}});
    fireEvent.click(screen.getByRole("button", {name: "smes.edit_save"}));

    await waitFor(() => expect(updateSme).toHaveBeenCalledWith("PRV-1002", expect.objectContaining({businessName: "Zuri Commerce HQ"})));
    expect(await screen.findByRole("status")).toBeTruthy();
  });

  it("approves a verification item after the checklist is complete", async () => {
    approveVerificationItem.mockResolvedValue(DETAIL);
    await openDrawer();

    fireEvent.click(screen.getByRole("tab", {name: "smes.tab_verification"}));
    fireEvent.click((await screen.findAllByText("smes.verification_mark_approved"))[0]);
    expect(await screen.findByText(/smes\.review_title/)).toBeTruthy();

    const approveButton = screen.getByRole<HTMLButtonElement>("button", {name: "smes.review_confirm"});
    expect(approveButton.disabled).toBe(true);
    // Approve stays disabled until every checklist line is ticked — the review modal is the topmost dialog.
    const dialogs = document.querySelectorAll("[role='dialog']");
    const review = dialogs[dialogs.length - 1];
    for (const label of Array.from(review.querySelectorAll("label"))) fireEvent.click(label);
    await waitFor(() => expect(approveButton.disabled).toBe(false));
    fireEvent.click(approveButton);

    await waitFor(() => expect(approveVerificationItem).toHaveBeenCalledWith("PRV-1002", "cac_certificate"));
    expect(await screen.findByRole("status")).toBeTruthy();
  });

  it("suspends an account through the kebab menu with a reason", async () => {
    suspendSme.mockResolvedValue({id: "PRV-1002", status: "suspended"});
    await openDrawer();

    fireEvent.click(screen.getByRole("button", {name: "smes.menu_aria"}));
    fireEvent.click(await screen.findByRole("menuitem", {name: /smes\.menu_suspend/}));

    expect(await screen.findByText("smes.suspend_title")).toBeTruthy();
    fireEvent.change(screen.getByRole("combobox", {name: "smes.suspend_reason_label"}), {target: {value: "payment_default"}});
    fireEvent.click(screen.getByRole("button", {name: "smes.suspend_confirm"}));

    await waitFor(() => expect(suspendSme).toHaveBeenCalledWith("PRV-1002", {reason: "payment_default", notes: undefined}));
    expect(await screen.findByRole("status")).toBeTruthy();
  });

  it("offers unsuspend for a suspended account", async () => {
    getSmeDetail.mockResolvedValue({
      ...DETAIL,
      id: "PRV-0357",
      businessName: "Urban Pulse Media",
      status: "suspended",
      suspension: {reason: "fraudulent_bulk_uploads", at: "2026-06-05T10:48:00Z"},
    });
    unsuspendSme.mockResolvedValue({id: "PRV-0357", status: "active"});
    renderRoute(SmesPage, "/smes");
    fireEvent.click(await screen.findByText("PRV-0357"));
    await screen.findByText("smes.business_info");

    fireEvent.click(screen.getByRole("button", {name: "smes.menu_aria"}));
    fireEvent.click(await screen.findByRole("menuitem", {name: "smes.menu_unsuspend"}));

    expect(await screen.findByText("smes.unsuspend_title")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "smes.unsuspend_confirm"}));
    await waitFor(() => expect(unsuspendSme).toHaveBeenCalledWith("PRV-0357", {notes: undefined}));
  });

  it("deactivates an account after picking a reason", async () => {
    deactivateSme.mockResolvedValue({id: "PRV-1002"});
    await openDrawer();

    fireEvent.click(screen.getByRole("button", {name: "smes.menu_aria"}));
    fireEvent.click(await screen.findByRole("menuitem", {name: "smes.menu_deactivate"}));

    expect(await screen.findByText("smes.deactivate_title")).toBeTruthy();
    const confirm = screen.getByRole<HTMLButtonElement>("button", {name: "smes.deactivate_confirm"});
    expect(confirm.disabled).toBe(true);

    fireEvent.change(screen.getByRole("combobox", {name: "smes.deactivate_reason_label"}), {target: {value: "customer_decision"}});
    fireEvent.click(screen.getByRole("button", {name: "smes.deactivate_confirm"}));

    await waitFor(() => expect(deactivateSme).toHaveBeenCalledWith("PRV-1002", {reason: "customer_decision"}));
    expect(await screen.findByRole("status")).toBeTruthy();
  });

  it("bulk-flags selected SMEs through the selection bar", async () => {
    flagSmes.mockResolvedValue({ids: ["PRV-1002", "PRV-0357"], status: "flagged"});
    renderRoute(SmesPage, "/smes");
    await screen.findByText("PRV-1002");

    fireEvent.click(screen.getByRole("checkbox", {name: "PRV-1002"}));
    fireEvent.click(screen.getByRole("checkbox", {name: "PRV-0357"}));

    fireEvent.click(screen.getByRole("button", {name: "workloads.flag_for_review"}));
    fireEvent.change(await screen.findByRole("combobox"), {target: {value: "other"}});
    fireEvent.click(screen.getByRole("button", {name: "workloads.flag_confirm"}));

    await waitFor(() => expect(flagSmes).toHaveBeenCalledWith({ids: ["PRV-1002", "PRV-0357"], reason: "other", notes: undefined}));
    expect(await screen.findByRole("status")).toBeTruthy();
  });

  it("bulk-suspends selected SMEs through the selection bar", async () => {
    suspendSme.mockResolvedValue({id: "PRV-1002", status: "suspended"});
    renderRoute(SmesPage, "/smes");
    await screen.findByText("PRV-1002");

    fireEvent.click(screen.getByRole("checkbox", {name: "PRV-1002"}));
    fireEvent.click(screen.getByRole("checkbox", {name: "PRV-0357"}));
    fireEvent.click(screen.getByRole("button", {name: "smes.menu_suspend"}));

    expect(await screen.findByText("smes.suspend_title")).toBeTruthy();
    fireEvent.change(screen.getByRole("combobox", {name: "smes.suspend_reason_label"}), {target: {value: "other"}});
    fireEvent.click(screen.getByRole("button", {name: "smes.suspend_confirm"}));

    await waitFor(() => expect(suspendSme).toHaveBeenCalledTimes(2));
    expect(await screen.findByRole("status")).toBeTruthy();
  });
});
