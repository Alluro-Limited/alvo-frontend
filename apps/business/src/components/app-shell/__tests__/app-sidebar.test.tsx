import {fireEvent, screen} from "@testing-library/react";
import {describe, expect, it} from "vite-plus/test";
import {OnboardingProvider} from "@/components/onboarding/onboarding-context";
import {renderRoute} from "@/test/render-route";
import {AppSidebar} from "../app-sidebar";

function SidebarShell() {
  return (
    <OnboardingProvider>
      <AppSidebar />
    </OnboardingProvider>
  );
}

describe("AppSidebar", () => {
  it("renders all nav destinations with the active Home pill", async () => {
    renderRoute(SidebarShell, "/dashboard");

    const home = (await screen.findAllByRole("link", {name: "nav.home"})).find((link) => link.className.includes("bg-primary-500"));
    expect(home?.getAttribute("href")).toBe("/dashboard");
    expect(screen.getByRole("link", {name: "nav.new_shipment"}).className).not.toContain("bg-primary-500");
    expect(screen.getByRole("link", {name: "nav.shipments"}).getAttribute("href")).toBe("/shipments");
    expect(screen.getByRole("link", {name: "nav.wallet"}).getAttribute("href")).toBe("/wallet");
    expect(screen.getByRole("link", {name: "nav.settings"}).getAttribute("href")).toBe("/settings");
    expect(screen.getByRole("link", {name: "nav.help_support"}).getAttribute("href")).toBe("/help");
    expect(screen.getByRole("button", {name: "nav.logout"})).toBeTruthy();
  });

  it("collapses to an icon-only rail and expands again", async () => {
    renderRoute(SidebarShell, "/dashboard");

    fireEvent.click(await screen.findByRole("button", {name: "nav.collapse_sidebar"}));
    const newShipment = screen.getByRole("link", {name: "nav.new_shipment"});
    expect(newShipment.getAttribute("title")).toBe("nav.new_shipment");
    expect(newShipment.textContent).toBe("");

    fireEvent.click(screen.getByRole("button", {name: "nav.expand_sidebar"}));
    expect(screen.getByRole("link", {name: "nav.new_shipment"}).textContent).toBe("nav.new_shipment");
  });
});
