import {fireEvent, screen} from "@testing-library/react";
import {describe, expect, it} from "vite-plus/test";
import {markOnboardingPending} from "@/lib/onboarding-flag";
import {renderRoute} from "@/test/render-route";
import {OnboardingProvider} from "../onboarding-context";
import {TourOverlay} from "../tour-overlay";
import {WelcomeModal} from "../welcome-modal";

function OnboardingTestShell() {
  return (
    <OnboardingProvider>
      <div data-tour="stats">stats anchor</div>
      <div data-tour="new-shipment">batch anchor</div>
      <div data-tour="shipments">shipments anchor</div>
      <div data-tour="wallet">wallet anchor</div>
      <WelcomeModal />
      <TourOverlay />
    </OnboardingProvider>
  );
}

const renderShell = () => renderRoute(OnboardingTestShell, "/");

describe("onboarding", () => {
  it("does not show the welcome modal when no signup flagged it", async () => {
    renderShell();

    await screen.findByText("stats anchor");
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("walks through all four tour steps after Start tour", async () => {
    markOnboardingPending();
    renderShell();

    const dialog = await screen.findByRole("dialog");
    expect(dialog.textContent).toContain("welcome.title");
    expect(dialog.textContent).toContain("welcome.description");
    expect(screen.getByRole("button", {name: "welcome.create_batches"}).getAttribute("href")).toBe("/new-shipment");

    fireEvent.click(screen.getByRole("button", {name: "welcome.start_tour"}));

    expect(await screen.findByText("tour.stats_title")).toBeTruthy();
    expect(screen.getByText("tour.stats_body")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", {name: "tour.next"}));
    expect(await screen.findByText("tour.batch_title")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", {name: "tour.next"}));
    expect(await screen.findByText("tour.shipments_title")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", {name: "tour.next"}));
    expect(await screen.findByText("tour.wallet_title")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", {name: "tour.next"}));
    expect(screen.queryByText("tour.wallet_title")).toBeNull();
  });

  it("Skip ends the tour immediately", async () => {
    markOnboardingPending();
    renderShell();

    await screen.findByRole("dialog");
    fireEvent.click(screen.getByRole("button", {name: "welcome.start_tour"}));
    await screen.findByText("tour.stats_title");

    fireEvent.click(screen.getAllByRole("button", {name: "tour.skip"})[0]);
    expect(screen.queryByText("tour.stats_title")).toBeNull();
  });
});
