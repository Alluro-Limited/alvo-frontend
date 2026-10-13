import {fireEvent, screen} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {accountService} from "@/services/account-service";
import {sendService} from "@/services/send-service";
import {renderRoute} from "@/test/render-route";
import type {LockerNode} from "@/types/send-types";
import type {SavedAddress} from "@/types/account-types";
import {AddressesPage} from "../addresses";

vi.mock("@/services/account-service", () => ({
  accountService: {
    getAccount: vi.fn(),
    updateName: vi.fn(),
    sendPhoneVerification: vi.fn(),
    verifyPhone: vi.fn(),
    getAddresses: vi.fn(),
    addAddress: vi.fn(),
    removeAddress: vi.fn(),
    requestAccountDeletion: vi.fn(),
    resendDeletionCode: vi.fn(),
    confirmAccountDeletion: vi.fn(),
    getWallet: vi.fn(),
    generateVirtualAccount: vi.fn(),
  },
}));

vi.mock("@/services/send-service", () => ({
  sendService: {
    getNodes: vi.fn(),
    getQuote: vi.fn(),
    createBooking: vi.fn(),
  },
}));

const getAddresses = vi.mocked(accountService.getAddresses);
const addAddress = vi.mocked(accountService.addAddress);
const removeAddress = vi.mocked(accountService.removeAddress);
const getNodes = vi.mocked(sendService.getNodes);

const nodeBase = {distance: "0.5km away", floor: "Ground Floor", access: "24/7", status: "available", sizes: "All sizes"} as const;

const NODES: LockerNode[] = [
  {id: "n-spice", name: "Spice Route", address: "19, Adeola Odeku Street, Victoria Island, Lagos State", ...nodeBase},
  {id: "n-palms", name: "The Palms Shopping Mall", address: "Lekki-Epe Expressway, Lekki, Lagos State", ...nodeBase},
];

const ADDRESSES: SavedAddress[] = [
  {id: "sa-1", name: "Ikeja City Mall", address: "Obafemi Awolowo Way, Ikeja, Lagos State"},
  {id: "sa-2", name: "Lekki Mall Node", address: "Second Entrance, Lekki Mall Node, Lagos State"},
];

describe("AddressesPage", () => {
  beforeEach(() => {
    getAddresses.mockReset().mockResolvedValue(ADDRESSES);
    addAddress.mockReset().mockResolvedValue(undefined);
    removeAddress.mockReset().mockResolvedValue(undefined);
    getNodes.mockReset().mockResolvedValue(NODES);
  });

  it("renders the saved list and the add button", async () => {
    renderRoute(AddressesPage, "/account/addresses");
    expect(await screen.findByText("Ikeja City Mall")).toBeTruthy();
    expect(screen.getByText("Obafemi Awolowo Way, Ikeja, Lagos State")).toBeTruthy();
    expect(screen.getByText("adr.title")).toBeTruthy();
    expect(screen.getByRole("button", {name: "adr.add"})).toBeTruthy();
  });

  it("adds an address picked from the sheet and shows the toast", async () => {
    renderRoute(AddressesPage, "/account/addresses");
    fireEvent.click(await screen.findByRole("button", {name: "adr.add"}));
    expect(await screen.findByRole("heading", {name: "adr.sheet_title"})).toBeTruthy();
    fireEvent.change(screen.getByLabelText("adr.search_ph"), {target: {value: "spice"}});
    fireEvent.click(screen.getByRole("button", {name: "Spice Route"}));
    await vi.waitFor(() => expect(addAddress).toHaveBeenCalledWith(expect.objectContaining({id: "n-spice"})));
    expect(await screen.findByText("adr.added")).toBeTruthy();
  });

  it("deletes an address after the confirmation dialog", async () => {
    renderRoute(AddressesPage, "/account/addresses");
    fireEvent.click(await screen.findByRole("button", {name: "adr.del_row Ikeja City Mall"}));
    expect(await screen.findByText("adr.del_title")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "adr.cancel"}));
    expect(screen.queryByText("adr.del_title")).not.toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "adr.del_row Ikeja City Mall"}));
    fireEvent.click(await screen.findByRole("button", {name: "adr.del_confirm"}));
    await vi.waitFor(() => expect(removeAddress).toHaveBeenCalledWith("sa-1"));
    expect(await screen.findByText("adr.deleted")).toBeTruthy();
  });
});
