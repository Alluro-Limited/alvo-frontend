import {screen} from "@testing-library/react";
import {describe, expect, it} from "vite-plus/test";
import {renderRoute} from "@/test/render-route";
import {GetHelpPage} from "../get-help";
import {LegalPage} from "../legal";

describe("GetHelpPage", () => {
  it("renders the four support-channel rows", async () => {
    renderRoute(GetHelpPage, "/account/help");
    expect(await screen.findByText("hlp.title")).toBeTruthy();
    expect(screen.getByRole("link", {name: /hlp.email/}).getAttribute("href")).toBe("mailto:support@alvo.com");
    expect(screen.getByText("hlp.instagram")).toBeTruthy();
    expect(screen.getByText("hlp.x")).toBeTruthy();
    expect(screen.getByText("hlp.chat")).toBeTruthy();
  });
});

describe("LegalPage", () => {
  it("renders the terms and privacy rows", async () => {
    renderRoute(LegalPage, "/account/legal");
    expect(await screen.findByText("leg.title")).toBeTruthy();
    expect(screen.getByText("leg.terms")).toBeTruthy();
    expect(screen.getByText("leg.privacy")).toBeTruthy();
  });
});
