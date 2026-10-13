import {fireEvent, screen} from "@testing-library/react";
import {describe, expect, it} from "vite-plus/test";
import {renderRoute} from "@/test/render-route";
import {OnboardingPage} from "../onboarding";

const getStarted = () => screen.getByRole("button", {name: "onb.get_started"});

describe("OnboardingPage", () => {
  it("walks the three slides, then lands on sign-up", async () => {
    renderRoute(OnboardingPage, "/onboarding");
    expect(await screen.findByRole("heading", {name: "onb.s1_title"})).toBeTruthy();

    fireEvent.click(getStarted());
    expect(await screen.findByRole("heading", {name: "onb.s2_title"})).toBeTruthy();

    fireEvent.click(getStarted());
    expect(await screen.findByRole("heading", {name: "onb.s3_title"})).toBeTruthy();

    fireEvent.click(getStarted());
    expect(await screen.findByText("stub:/sign-up")).toBeTruthy();
  });

  it("links Log in to sign-in", async () => {
    renderRoute(OnboardingPage, "/onboarding");
    expect((await screen.findByRole("link", {name: "onb.login"})).getAttribute("href")).toBe("/sign-in");
  });
});
