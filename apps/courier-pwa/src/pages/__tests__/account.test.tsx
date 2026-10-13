import {fireEvent, screen, waitFor} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {accountService} from "@/services/account-service";
import {renderRoute} from "@/test/render-route";
import type {CourierProfile} from "@/types/earnings-types";
import {AccountPage} from "../account";
import {PersonalInfoPage} from "../personal-info";
import {SupportPage} from "../support";

vi.mock("@/services/account-service", () => ({
  accountService: {
    getProfile: vi.fn(),
    getSupportContact: vi.fn(),
    signOut: vi.fn(),
    requestDeleteCode: vi.fn(),
    deleteAccount: vi.fn(),
    requestVehicleChange: vi.fn(),
  },
}));

const getProfile = vi.mocked(accountService.getProfile);
const getSupportContact = vi.mocked(accountService.getSupportContact);
const signOut = vi.mocked(accountService.signOut);

const PROFILE: CourierProfile = {
  name: "Olanrewaju Quadri",
  courierId: "CRR-00284",
  email: "olatunji@Alvo.com",
  phone: "08012345678",
  avatarUrl: null,
  vehicle: "motorcycle",
};

describe("AccountPage", () => {
  beforeEach(() => {
    getProfile.mockReset().mockResolvedValue(PROFILE);
  });

  it("shows the profile card, both menu cards, and the version footer", async () => {
    renderRoute(AccountPage, "/profile");
    expect(await screen.findByText("Olanrewaju Quadri")).toBeTruthy();
    expect(screen.getByText("CRR-00284")).toBeTruthy();
    expect(screen.getByText("account.work")).toBeTruthy();
    expect(screen.getByText("account.prefs")).toBeTruthy();
    expect(screen.getByText("account.manage")).toBeTruthy();
    expect(screen.getByText("account.contact")).toBeTruthy();
    expect(screen.getByText("V 1.0.0")).toBeTruthy();
  });
});

describe("PersonalInfoPage", () => {
  it("shows the read-only info card and account actions", async () => {
    getProfile.mockReset().mockResolvedValue(PROFILE);
    renderRoute(PersonalInfoPage, "/personal-information");
    expect(await screen.findByText("olatunji@Alvo.com")).toBeTruthy();
    expect(screen.getByText("account.basic")).toBeTruthy();
    expect(screen.getByText("account.signout")).toBeTruthy();
    expect(screen.getByText("account.delete")).toBeTruthy();
    expect(screen.getByText("account.security_note")).toBeTruthy();
  });

  it("asks for confirmation before signing out, then lands on sign-in", async () => {
    getProfile.mockReset().mockResolvedValue(PROFILE);
    signOut.mockReset().mockResolvedValue(undefined);
    renderRoute(PersonalInfoPage, "/personal-information");
    fireEvent.click(await screen.findByText("account.signout"));
    expect(await screen.findByText("so.title")).toBeTruthy();
    expect(signOut).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", {name: "so.confirm"}));
    expect(await screen.findByText("stub:/sign-in")).toBeTruthy();
    expect(signOut).toHaveBeenCalled();
  });

  it("dismisses the confirmation with stay signed in", async () => {
    getProfile.mockReset().mockResolvedValue(PROFILE);
    renderRoute(PersonalInfoPage, "/personal-information");
    fireEvent.click(await screen.findByText("account.signout"));
    fireEvent.click(await screen.findByRole("button", {name: "so.stay"}));
    await waitFor(() => expect(screen.queryByText("so.title")).toBeNull());
    expect(screen.getByText("account.personal")).toBeTruthy();
  });
});

describe("SupportPage", () => {
  it("shows the courier support card with tel/mail actions", async () => {
    getSupportContact.mockReset().mockResolvedValue({
      team: "Courier Support",
      availability: "Available 6 AM – 10 PM",
      phone: "08012345678",
      email: "courier@company.com",
    });
    renderRoute(SupportPage, "/support");
    expect(await screen.findByText("Courier Support")).toBeTruthy();
    expect(screen.getByText("Available 6 AM – 10 PM")).toBeTruthy();
    expect(screen.getByRole("link", {name: "support.call"})).toBeTruthy();
    expect(screen.getByRole("link", {name: "support.write"})).toBeTruthy();
  });
});
