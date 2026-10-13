import {fireEvent, screen, waitFor} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {accountService} from "@/services/account-service";
import {renderRoute} from "@/test/render-route";
import type {CourierProfile} from "@/types/earnings-types";
import {VehiclePage} from "../vehicle";

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
const requestVehicleChange = vi.mocked(accountService.requestVehicleChange);

const PROFILE: CourierProfile = {
  name: "Olanrewaju Quadri",
  courierId: "CRR-00284",
  email: "olatunji@Alvo.com",
  phone: "08012345678",
  avatarUrl: null,
  vehicle: "motorcycle",
};

const vehicleSelect = () => screen.getByRole("combobox", {name: "veh.type"});

describe("VehiclePage", () => {
  beforeEach(() => {
    getProfile.mockReset().mockResolvedValue(PROFILE);
    requestVehicleChange.mockReset().mockResolvedValue(undefined);
  });

  it("shows the current vehicle's capacity card", async () => {
    renderRoute(VehiclePage, "/vehicle");
    expect(await screen.findByText("veh.desc_motorcycle")).toBeTruthy();
    expect(screen.getByText("veh.title")).toBeTruthy();
    expect(screen.getByText("veh.packages")).toBeTruthy();
    expect(screen.getByText("veh.weight")).toBeTruthy();
  });

  it("keeps Request Change disabled until a different vehicle is picked", async () => {
    renderRoute(VehiclePage, "/vehicle");
    const request = await screen.findByRole("button", {name: "vehc.request"});
    expect(request).toHaveProperty("disabled", true);
    fireEvent.change(vehicleSelect(), {target: {value: "car"}});
    expect(screen.getByText("veh.desc_car")).toBeTruthy();
    expect(request).toHaveProperty("disabled", false);
  });

  it("confirms in the sheet, submits, and shows the submitted state", async () => {
    renderRoute(VehiclePage, "/vehicle");
    fireEvent.change(await screen.findByRole("combobox", {name: "veh.type"}), {target: {value: "car"}});
    fireEvent.click(screen.getByRole("button", {name: "vehc.request"}));
    expect(await screen.findByText("vehc.title")).toBeTruthy();
    const requests = screen.getAllByRole("button", {name: "vehc.request"});
    fireEvent.click(requests[requests.length - 1]);
    await waitFor(() => expect(requestVehicleChange).toHaveBeenCalledWith("car"));
    expect(await screen.findByText("vehd.title")).toBeTruthy();
    expect(screen.getByText("vehd.next")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "vehd.back"}));
    expect(await screen.findByText("stub:/profile")).toBeTruthy();
  });

  it("cancel in the sheet closes it without submitting", async () => {
    renderRoute(VehiclePage, "/vehicle");
    fireEvent.change(await screen.findByRole("combobox", {name: "veh.type"}), {target: {value: "van"}});
    fireEvent.click(screen.getByRole("button", {name: "vehc.request"}));
    fireEvent.click(await screen.findByRole("button", {name: "home.cancel"}));
    await waitFor(() => expect(screen.queryByText("vehc.title")).toBeNull());
    expect(requestVehicleChange).not.toHaveBeenCalled();
  });
});
