import {fireEvent, screen, waitFor} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {safeService} from "@/services/safe-service";
import {renderRoute} from "@/test/render-route";
import {SafePage} from "../safe";

vi.mock("@/services/safe-service", () => ({
  safeService: {
    getNodes: vi.fn(),
    getOptions: vi.fn(),
    getQuote: vi.fn(),
    reserve: vi.fn(),
  },
}));

const svc = vi.mocked(safeService);

const base = {
  distance: "0.5km away",
  floor: "Ground Floor",
  access: "24/7 Access • CCTV & Security Guarded",
  sizes: "All sizes",
  status: "available" as const,
};
const NODES = [
  {id: "n1", name: "Lekki Mall Node", address: "Second Entrance, Lekki, Lagos State", safes: 15, ...base},
  {id: "n2", name: "Mega Plaza", address: "15, Adeola Odeku Street, VI, Lagos State", safes: 0, ...base},
];
const OPTIONS = {
  sizes: [
    {id: "small" as const, label: "Small", dims: "30x20x15cm", hourlyRate: 500},
    {id: "medium" as const, label: "Medium", dims: "45x30x25cm", hourlyRate: 700},
    {id: "large" as const, label: "Large", dims: "60x40x35cm", hourlyRate: 800},
  ],
  durations: [
    {id: "d4", label: "4 Hours", hours: 4, until: "until 6:00 PM"},
    {id: "d24", label: "1 Day", hours: 24, until: "until tomorrow, 2:00 PM"},
  ],
};
const QUOTE = {
  lines: [
    {id: "safe", label: "Standard Safe (4 hrs × ₦500/hr)", amount: 2000},
    {id: "fee", label: "Service Fee:", amount: 0},
  ],
  total: 2000,
  walletBalance: 12500,
};
const RESERVATION = {
  storageId: "STR9245",
  location: "Lekki Mall Node Locker Node, Ground Floor, Near Entrance 2",
  validUntil: "6:00 PM today",
  remaining: "3 hours 45 mins remaining",
  accessCode: "B-1247",
};

const continueBtn = () => screen.getByRole("button", {name: "send.continue"});
const radio = (name: string) => screen.getByRole("radio", {name: new RegExp(name)});

async function openNodeSheet() {
  fireEvent.click(screen.getByRole("button", {name: "safe.node_ph"}));
  await screen.findByText("send.node_sheet");
}

async function toOptionsStep() {
  renderRoute(SafePage, "/safe");
  expect(await screen.findByText("safe.select_node")).toBeTruthy();
  await openNodeSheet();
  fireEvent.click(await screen.findByRole("button", {name: "Lekki Mall Node"}));
  fireEvent.click(continueBtn());
  await screen.findByText("safe.find");
}

async function pickOptions() {
  fireEvent.click(radio("Small"));
  fireEvent.change(screen.getByLabelText("safe.duration"), {target: {value: "d4"}});
}

describe("SafePage", () => {
  beforeEach(() => {
    svc.getNodes.mockReset().mockResolvedValue(NODES);
    svc.getOptions.mockReset().mockResolvedValue(OPTIONS);
    svc.getQuote.mockReset().mockResolvedValue(QUOTE);
    svc.reserve.mockReset().mockResolvedValue(RESERVATION);
  });

  it("shows the node step and opens the Select Locker sheet", async () => {
    renderRoute(SafePage, "/safe");
    expect(await screen.findByText("safe.desc")).toBeTruthy();
    expect(screen.getByText("safe.select_node")).toBeTruthy();
    await openNodeSheet();
    expect(await screen.findByRole("button", {name: "Lekki Mall Node"})).toBeTruthy();
  });

  it("shows the Near Me location prompt and the favorites empty state", async () => {
    renderRoute(SafePage, "/safe");
    await screen.findByText("safe.select_node");
    await openNodeSheet();
    fireEvent.click(radio("send.chip_near"));
    expect(await screen.findByText("send.locate_title")).toBeTruthy();
    fireEvent.click(radio("send.chip_fav"));
    expect(await screen.findByText("send.fav_none_title")).toBeTruthy();
  });

  it("shows the fully-booked state and blocks Continue for a full node", async () => {
    renderRoute(SafePage, "/safe");
    await screen.findByText("safe.select_node");
    await openNodeSheet();
    fireEvent.click(await screen.findByRole("button", {name: "Mega Plaza"}));
    expect(await screen.findByText("safe.fully_booked")).toBeTruthy();
    expect(screen.getByText("safe.full_title")).toBeTruthy();
    fireEvent.click(continueBtn());
    expect(screen.getByText("safe.select_node")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "safe.view_alt"}));
    expect(await screen.findByText("send.node_sheet")).toBeTruthy();
  });

  it("gates Find a Safe on picking a size and duration", async () => {
    await toOptionsStep();
    expect(await screen.findByText("safe.size_label")).toBeTruthy();
    fireEvent.click(continueBtn());
    expect(screen.getByText("safe.size_label")).toBeTruthy();
    await pickOptions();
    fireEvent.click(continueBtn());
    expect(await screen.findByText("safe.review_title")).toBeTruthy();
  });

  it("completes review → reserved → guide → access code", async () => {
    await toOptionsStep();
    await pickOptions();
    fireEvent.click(continueBtn());
    await screen.findByText("safe.review_title");
    fireEvent.click(radio("send.wallet"));
    fireEvent.click(screen.getByRole("button", {name: /safe\.pay_reserve/}));
    await waitFor(() => expect(svc.reserve).toHaveBeenCalled());
    expect(await screen.findByText("safe.reserved_title")).toBeTruthy();
    expect(screen.getByText("#STR9245")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "safe.guide"}));
    expect(await screen.findByText("send.guide_title")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "send.got_it"}));
    fireEvent.click(screen.getByRole("button", {name: "safe.open_now"}));
    expect(await screen.findByText("send.code_title")).toBeTruthy();
    expect(screen.getByText("B - 1 2 4 7")).toBeTruthy();
  });

  it("opens the payment gateway sheet for online payment", async () => {
    await toOptionsStep();
    await pickOptions();
    fireEvent.click(continueBtn());
    await screen.findByText("safe.review_title");
    fireEvent.click(radio("send.online"));
    fireEvent.click(screen.getByRole("button", {name: /safe\.pay_reserve/}));
    expect(await screen.findByText("safe.gateway")).toBeTruthy();
    await waitFor(() => expect(svc.reserve).toHaveBeenCalledWith(expect.objectContaining({channel: "online"})));
    expect(await screen.findByText("safe.reserved_title")).toBeTruthy();
  });
});
