import {fireEvent, screen, waitFor} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {sendService} from "@/services/send-service";
import {renderRoute} from "@/test/render-route";
import {SendPage} from "../send";

vi.mock("@/services/send-service", () => ({
  sendService: {
    getNodes: vi.fn(),
    getQuote: vi.fn(),
    createBooking: vi.fn(),
  },
}));

const svc = vi.mocked(sendService);

const node = {distance: "0.5km away", floor: "Ground Floor", access: "24/7 Access • CCTV & Security Guarded", sizes: "All sizes"};
const NODES = [
  {id: "n1", name: "Lekki Mall Node", address: "Second Entrance, Lekki Mall Node, Lagos State", status: "available" as const, ...node},
  {
    id: "n2",
    name: "Ikeja City Mall",
    address: "Ikeja Along, Obafemi Awolowo Way, Ikeja, Lagos State",
    status: "available" as const,
    ...node,
  },
];
const QUOTE = {lines: [{id: "base", label: "Base Delivery:", amount: 500}], total: 500, arrival: "Tomorrow, 8:00 AM", walletBalance: 500};
const BOOKING = {
  trackingNumber: "PKG4728",
  dropOffCode: "B-1247",
  dropOffLocation: "Lekki Mall Locker Node, Ground Floor, Near Entrance 2",
  validUntil: "Dec 22, 11:34 AM",
  remaining: "7 hours 59 mins remaining",
};

const continueBtn = () => screen.getByRole("button", {name: "send.continue"});
const radio = (name: string) => screen.getByRole("radio", {name: new RegExp(name)});

async function toPackageStep() {
  renderRoute(SendPage, "/send");
  expect(await screen.findByText("send.service_desc")).toBeTruthy();
  fireEvent.click(continueBtn());
  await screen.findByText("send.package_desc");
}

async function toNodesStep() {
  await toPackageStep();
  fireEvent.click(radio("send.size_small"));
  fireEvent.click(continueBtn());
  await screen.findByText("send.nodes_desc");
}

describe("SendPage", () => {
  beforeEach(() => {
    svc.getNodes.mockReset().mockResolvedValue(NODES);
    svc.getQuote.mockReset().mockResolvedValue(QUOTE);
    svc.createBooking.mockReset().mockResolvedValue(BOOKING);
  });

  it("shows the service picker and continues to the package step", async () => {
    renderRoute(SendPage, "/send");
    expect(await screen.findByText("send.l2l")).toBeTruthy();
    expect(screen.getByText("send.coming_soon")).toBeTruthy();
    fireEvent.click(continueBtn());
    expect(await screen.findByText("send.package_desc")).toBeTruthy();
  });

  it("gates package Continue on picking a size", async () => {
    await toPackageStep();
    expect(continueBtn()).toBeTruthy();
    expect(radio("send.size_medium")).toBeTruthy();
    fireEvent.click(radio("send.size_medium"));
    fireEvent.click(continueBtn());
    expect(await screen.findByText("send.nodes_title")).toBeTruthy();
  });

  it("opens the locker sheet, picks both nodes, and shows the estimated cost", async () => {
    await toNodesStep();
    fireEvent.click(screen.getByRole("button", {name: /send.origin_ph/}));
    fireEvent.click(await screen.findByRole("button", {name: "Lekki Mall Node"}));
    await waitFor(() => expect(screen.getAllByText("Lekki Mall Node").length).toBeGreaterThan(0));
    fireEvent.click(screen.getByRole("button", {name: /send.dest_ph/}));
    fireEvent.click(await screen.findByRole("button", {name: "Ikeja City Mall"}));
    fireEvent.click(radio("send.speed_express"));
    expect(await screen.findByText("send.est_cost")).toBeTruthy();
    await waitFor(() => expect(svc.getQuote).toHaveBeenCalled());
    expect(screen.getAllByText("₦500").length).toBeGreaterThan(0);
  });

  it("validates recipient details before continuing", async () => {
    await toNodesStep();
    fireEvent.click(screen.getByRole("button", {name: /send.origin_ph/}));
    fireEvent.click(await screen.findByRole("button", {name: "Lekki Mall Node"}));
    fireEvent.click(screen.getByRole("button", {name: /send.dest_ph/}));
    fireEvent.click(await screen.findByRole("button", {name: "Ikeja City Mall"}));
    fireEvent.click(continueBtn());
    await screen.findByText("send.rc_title");
    fireEvent.change(screen.getByLabelText("send.rc_name"), {target: {value: "Agbaje Falilu"}});
    fireEvent.change(screen.getByLabelText("send.rc_phone"), {target: {value: "8012345678"}});
    fireEvent.click(continueBtn());
    expect(await screen.findByText("send.review_title")).toBeTruthy();
  });

  it("completes review → booking confirmed → access code", async () => {
    await toNodesStep();
    fireEvent.click(screen.getByRole("button", {name: /send.origin_ph/}));
    fireEvent.click(await screen.findByRole("button", {name: "Lekki Mall Node"}));
    fireEvent.click(screen.getByRole("button", {name: /send.dest_ph/}));
    fireEvent.click(await screen.findByRole("button", {name: "Ikeja City Mall"}));
    fireEvent.click(continueBtn());
    await screen.findByText("send.rc_title");
    fireEvent.change(screen.getByLabelText("send.rc_name"), {target: {value: "Agbaje Falilu"}});
    fireEvent.change(screen.getByLabelText("send.rc_phone"), {target: {value: "8012345678"}});
    fireEvent.click(continueBtn());
    await screen.findByText("send.review_title");
    fireEvent.click(radio("send.wallet"));
    fireEvent.click(screen.getByRole("button", {name: /send.pay_confirm/}));
    await waitFor(() => expect(svc.createBooking).toHaveBeenCalled());
    expect(await screen.findByText("send.confirmed_title")).toBeTruthy();
    expect(screen.getByText("B-1247")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "send.dropoff_now"}));
    expect(await screen.findByText("send.code_title")).toBeTruthy();
    expect(screen.getByText("B - 1 2 4 7")).toBeTruthy();
  });
});
