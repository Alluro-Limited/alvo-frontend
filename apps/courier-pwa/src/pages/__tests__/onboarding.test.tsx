import {screen} from "@testing-library/react";
import {describe, expect, it} from "vite-plus/test";
import {renderRoute} from "@/test/render-route";
import {OnboardingPage} from "../onboarding";

describe("OnboardingPage", () => {
  it("renders all three slides with titles and subtitles", async () => {
    renderRoute(OnboardingPage, "/onboarding");
    expect(await screen.findByRole("heading", {name: "ob.slide1_title"})).toBeTruthy();
    expect(screen.getByRole("heading", {name: "ob.slide2_title"})).toBeTruthy();
    expect(screen.getByRole("heading", {name: "ob.slide3_title"})).toBeTruthy();
    expect(screen.getByText("ob.slide1_sub")).toBeTruthy();
    expect(screen.getByText("ob.slide2_sub")).toBeTruthy();
    expect(screen.getByText("ob.slide3_sub")).toBeTruthy();
  });

  it("links Get Started to sign-up and Log in to sign-in", async () => {
    renderRoute(OnboardingPage, "/onboarding");
    const cta = await screen.findByText("ob.cta");
    expect(cta.closest("a")?.getAttribute("href")).toBe("/sign-up");
    expect(screen.getByRole("link", {name: "ob.login_link"}).getAttribute("href")).toBe("/sign-in");
  });
});
