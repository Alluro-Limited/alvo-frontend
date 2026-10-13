import {screen} from "@testing-library/react";
import {afterEach, beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {renderRoute} from "@/test/render-route";
import {SplashPage} from "../splash";

describe("SplashPage", () => {
  beforeEach(() => vi.useFakeTimers({shouldAdvanceTime: true}));
  afterEach(() => vi.useRealTimers());

  it("renders the logo and tagline", async () => {
    renderRoute(SplashPage, "/");
    expect(await screen.findByRole("img", {name: "app.title"})).toBeTruthy();
    expect(screen.getByText("splash.tagline")).toBeTruthy();
  });

  it("advances to onboarding after the splash duration", async () => {
    renderRoute(SplashPage, "/");
    await screen.findByText("splash.tagline");
    await vi.advanceTimersByTimeAsync(1900);
    expect(await screen.findByText("stub:/onboarding")).toBeTruthy();
  });
});
