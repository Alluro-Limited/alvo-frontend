import {screen} from "@testing-library/react";
import {describe, expect, it} from "vite-plus/test";
import {renderRoute} from "@/test/render-route";
import {SupportPage} from "../support";

describe("SupportPage", () => {
  it("renders the title and the four support-channel cards", async () => {
    renderRoute(SupportPage, "/support");
    expect(await screen.findByText("sup.title")).toBeTruthy();
    expect(screen.getByText("sup.phone")).toBeTruthy();
    expect(screen.getByText("sup.phone_d")).toBeTruthy();
    expect(screen.getByText("sup.email")).toBeTruthy();
    expect(screen.getByText("sup.whatsapp")).toBeTruthy();
    expect(screen.getByText("sup.chat")).toBeTruthy();
    expect(screen.getByRole("link", {name: /sup.email/}).getAttribute("href")).toBe("mailto:support@alvo.com");
  });
});
