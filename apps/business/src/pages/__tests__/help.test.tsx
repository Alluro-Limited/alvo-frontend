import {fireEvent, screen} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {renderRoute} from "@/test/render-route";
import {HelpPage} from "../help";

describe("HelpPage", () => {
  it("renders the heading, topic cards, and contact cards", async () => {
    renderRoute(HelpPage, "/help");
    expect(await screen.findByRole("heading", {name: "help.title"})).toBeTruthy();
    expect(screen.getByText("help.topic_wallet")).toBeTruthy();
    expect(screen.getByText("help.topic_account")).toBeTruthy();
    expect(screen.getByText("help.chat_title")).toBeTruthy();
    expect(screen.getByText("help.email_title")).toBeTruthy();
    expect(screen.getByText("help.call_title")).toBeTruthy();
    expect(screen.getByText("support@alvo.com")).toBeTruthy();
    expect(screen.getByText("0800 123 4567")).toBeTruthy();
  });

  it("copies the support email and shows the Copied state", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {value: {writeText}, configurable: true});
    renderRoute(HelpPage, "/help");

    fireEvent.click(await screen.findByRole("button", {name: "help.copy_email"}));
    expect(writeText).toHaveBeenCalledWith("support@alvo.com");
    expect(await screen.findByText("help.copied")).toBeTruthy();
  });
});
