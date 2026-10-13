import {fireEvent, screen, waitFor} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {BottomNav} from "@/components/app/bottom-nav";
import {homeService} from "@/services/home-service";
import {renderRoute} from "@/test/render-route";
import type {CourierHome, CourierJob} from "@/types/home-types";
import {HomePage} from "../home";

vi.mock("@/services/home-service", () => ({
  homeService: {getHome: vi.fn(), setAvailability: vi.fn(), acceptJob: vi.fn(), declineJob: vi.fn()},
}));

const getHome = vi.mocked(homeService.getHome);
const setAvailability = vi.mocked(homeService.setAvailability);
const acceptJob = vi.mocked(homeService.acceptJob);
const declineJob = vi.mocked(homeService.declineJob);

function job(stage: CourierJob["stage"], kind: CourierJob["kind"] = "regular"): CourierJob {
  return {
    id: "PRI-4728123780",
    kind,
    stage,
    origin: "OSHODI",
    destination: "AJAH",
    payout: 4000,
    packages: 7,
    pickupTime: "17:50",
    eta: "19:05",
    duration: "1HR 15MIN",
    distanceKm: 3.5,
  };
}

function home(overrides: Partial<CourierHome>): CourierHome {
  return {firstName: "Olatunji", area: "Oshodi", isLive: true, unreadNotifications: true, jobs: [], ...overrides};
}

function liveHome(jobs: CourierJob[] = []) {
  getHome.mockResolvedValue(home({jobs}));
}

describe("HomePage", () => {
  beforeEach(() => {
    getHome.mockReset();
    setAvailability.mockReset().mockResolvedValue(undefined);
    acceptJob.mockReset().mockResolvedValue(undefined);
    declineJob.mockReset().mockResolvedValue(undefined);
  });

  it("shows the offline state in both sections while not live", async () => {
    getHome.mockResolvedValue(home({isLive: false}));
    renderRoute(HomePage, "/home");
    expect(await screen.findByText("home.offline")).toBeTruthy();
    expect(screen.getAllByText("home.offline_title")).toHaveLength(2);
  });

  it("shows the empty states while live with no jobs", async () => {
    liveHome();
    renderRoute(HomePage, "/home");
    expect(await screen.findByText("home.live")).toBeTruthy();
    expect(screen.getByText("home.empty_regular")).toBeTruthy();
    expect(screen.getByText("home.empty_speed")).toBeTruthy();
  });

  it("toggles availability", async () => {
    getHome.mockResolvedValue(home({isLive: false}));
    renderRoute(HomePage, "/home");
    fireEvent.click(await screen.findByRole("switch", {name: "home.availability"}));
    await waitFor(() => expect(setAvailability).toHaveBeenCalledWith(true));
  });

  it("shows the assignment card and declines the offer", async () => {
    liveHome([job("assignment")]);
    renderRoute(HomePage, "/home");
    expect(await screen.findByText("PRI-4728123780")).toBeTruthy();
    expect(screen.getByText("home.stage_assignment")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "home.decline"}));
    await waitFor(() => expect(declineJob).toHaveBeenCalledWith("PRI-4728123780"));
  });

  it("gates Accept job behind the responsibility checkbox", async () => {
    liveHome([job("assignment")]);
    renderRoute(HomePage, "/home");
    fireEvent.click(await screen.findByRole("button", {name: "home.accept"}));
    expect(await screen.findByText("home.confirm_title")).toBeTruthy();
    expect(screen.getByRole("button", {name: "home.confirm_accept"})).toHaveProperty("disabled", true);
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", {name: "home.confirm_accept"}));
    await waitFor(() => expect(acceptJob).toHaveBeenCalledWith("PRI-4728123780"));
  });

  it("cancelling the dialog leaves the offer open", async () => {
    liveHome([job("assignment")]);
    renderRoute(HomePage, "/home");
    fireEvent.click(await screen.findByRole("button", {name: "home.accept"}));
    fireEvent.click(await screen.findByRole("button", {name: "home.cancel"}));
    await waitFor(() => expect(screen.queryByText("home.confirm_title")).toBeNull());
    expect(acceptJob).not.toHaveBeenCalled();
  });

  it("shows View Details for a pending job and enroute progress", async () => {
    liveHome([job("enroute")]);
    renderRoute(HomePage, "/home");
    expect(await screen.findByText("home.stage_enroute")).toBeTruthy();
    expect(screen.getByRole("link", {name: "home.view_details"})).toBeTruthy();
  });

  it("navigates to the other tabs from the bottom nav", async () => {
    renderRoute(() => <BottomNav />, "/home");
    fireEvent.click(await screen.findByRole("link", {name: "nav.deliveries"}));
    expect(await screen.findByText("stub:/deliveries")).toBeTruthy();
  });
});
