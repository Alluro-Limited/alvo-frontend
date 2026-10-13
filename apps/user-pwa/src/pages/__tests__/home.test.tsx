import {fireEvent, screen, waitFor} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {homeService} from "@/services/home-service";
import {renderRoute} from "@/test/render-route";
import {HomePage} from "../home";

vi.mock("@/services/home-service", () => ({
  homeService: {
    getArea: vi.fn(),
    setArea: vi.fn(),
    getLockers: vi.fn(),
    getLocker: vi.fn(),
    searchAreas: vi.fn(),
  },
}));

const svc = vi.mocked(homeService);

const PIN = {id: "p12", label: "P12", x: 40, y: 40, color: "#ff5c7a"};
const LOCKER = {id: "p12", name: "Locker P12 – Ikeja", available: true, slots: 32};
const AREA_RESULT = {id: "a1", address: "129 Igbogbo Road, Ikorodu, Lagos", area: "Ikorodu, Lagos State"};

describe("HomePage", () => {
  beforeEach(() => {
    svc.getArea.mockReset().mockResolvedValue("Oshodi");
    svc.setArea.mockReset().mockResolvedValue(undefined);
    svc.getLockers.mockReset().mockResolvedValue([PIN]);
    svc.getLocker.mockReset().mockResolvedValue(LOCKER);
    svc.searchAreas.mockReset().mockResolvedValue([]);
    window.localStorage.clear();
    window.localStorage.setItem("alvo.home-tour-seen", "1");
  });

  it("plays the welcome sheet and walks the tour on first visit", async () => {
    window.localStorage.removeItem("alvo.home-tour-seen");
    renderRoute(HomePage, "/home");
    expect(await screen.findByText("tour.welcome_title")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", {name: "tour.take_tour"}));
    expect(await screen.findByText("tour.location")).toBeTruthy();
    for (const key of ["tour.send", "tour.store", "tour.activities", "tour.support"]) {
      fireEvent.click(screen.getByRole("button", {name: "tour.next"}));
      expect(await screen.findByText(key)).toBeTruthy();
    }
    fireEvent.click(screen.getByRole("button", {name: "tour.next"}));
    expect(screen.getByRole("button", {name: "tour.done"})).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "tour.done"}));
    await waitFor(() => expect(screen.queryByText("tour.account")).not.toBeTruthy());
    expect(window.localStorage.getItem("alvo.home-tour-seen")).toBe("1");
  });

  it("skips the tour from the welcome sheet", async () => {
    window.localStorage.removeItem("alvo.home-tour-seen");
    renderRoute(HomePage, "/home");
    expect(await screen.findByText("tour.welcome_title")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "tour.skip"}));
    await waitFor(() => expect(screen.queryByText("tour.welcome_title")).not.toBeTruthy());
    expect(window.localStorage.getItem("alvo.home-tour-seen")).toBe("1");
  });

  it("renders the collapsed sheet with the area chip and track input", async () => {
    renderRoute(HomePage, "/home");
    expect(await screen.findByText("Oshodi")).toBeTruthy();
    expect(screen.getByLabelText("home.track")).toBeTruthy();
    expect(await screen.findByText("P12")).toBeTruthy();
  });

  it("expands the sheet to show actions, banner, and recent activity", async () => {
    renderRoute(HomePage, "/home");
    await screen.findByRole("button", {name: "home.expand"});
    fireEvent.click(screen.getByRole("button", {name: "home.expand"}));
    expect(await screen.findByText("home.send")).toBeTruthy();
    expect(screen.getByText("home.store")).toBeTruthy();
    expect(screen.getByText("home.recent")).toBeTruthy();
    expect(screen.getByText("home.no_activity")).toBeTruthy();
  });

  it("opens the locker modal when a pin is tapped", async () => {
    renderRoute(HomePage, "/home");
    fireEvent.click(await screen.findByText("P12"));
    expect(await screen.findByText("Locker P12 – Ikeja")).toBeTruthy();
    expect(screen.getByRole("button", {name: "home.direction"})).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "home.cancel"}));
    await waitFor(() => expect(screen.queryByText("Locker P12 – Ikeja")).not.toBeTruthy());
  });

  it("searches areas and updates the chip when a result is picked", async () => {
    svc.searchAreas.mockResolvedValue([AREA_RESULT]);
    renderRoute(HomePage, "/home");
    fireEvent.click(await screen.findByText("Oshodi"));
    fireEvent.change(await screen.findByLabelText("loc.search"), {target: {value: "lekki"}});
    fireEvent.click(await screen.findByRole("button", {name: AREA_RESULT.address}));
    await waitFor(() => expect(svc.setArea).toHaveBeenCalledWith("Ikorodu"));
  });

  it("shows the no-results state for an unknown area", async () => {
    renderRoute(HomePage, "/home");
    fireEvent.click(await screen.findByText("Oshodi"));
    fireEvent.change(await screen.findByLabelText("loc.search"), {target: {value: "zzzz"}});
    expect(await screen.findByText("loc.none")).toBeTruthy();
  });

  it("opens the send terms dialog from the tile and continues to /send", async () => {
    const router = renderRoute(HomePage, "/home");
    fireEvent.click(await screen.findByRole("button", {name: "home.expand"}));
    fireEvent.click(await screen.findByRole("button", {name: "home.send"}));
    expect(await screen.findByText("send.terms_title")).toBeTruthy();
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", {name: "send.agree_continue"}));
    await waitFor(() => expect(router.state.location.pathname).toBe("/send"));
  });

  it("opens the terms dialog from the Safe Storage tile and continues to /safe", async () => {
    const router = renderRoute(HomePage, "/home");
    fireEvent.click(await screen.findByRole("button", {name: "home.expand"}));
    fireEvent.click(await screen.findByRole("button", {name: "home.store"}));
    expect(await screen.findByText("send.terms_title")).toBeTruthy();
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", {name: "send.agree_continue"}));
    await waitFor(() => expect(router.state.location.pathname).toBe("/safe"));
  });
});
