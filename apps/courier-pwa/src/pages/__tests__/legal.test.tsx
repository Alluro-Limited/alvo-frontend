import {fireEvent, screen} from "@testing-library/react";
import {describe, expect, it} from "vite-plus/test";
import {renderRoute} from "@/test/render-route";
import {LegalPage} from "../legal";
import {LegalDocPage} from "../legal-doc";

describe("LegalPage", () => {
  it("shows the four legal document links", async () => {
    renderRoute(LegalPage, "/legal");
    expect(await screen.findByText("legal.title")).toBeTruthy();
    expect(screen.getByText("legal.terms")).toBeTruthy();
    expect(screen.getByText("legal.privacy")).toBeTruthy();
    expect(screen.getByText("legal.conduct")).toBeTruthy();
    expect(screen.getByText("legal.liability")).toBeTruthy();
  });

  it("navigates into a document when a row is clicked", async () => {
    renderRoute(LegalPage, "/legal");
    fireEvent.click(await screen.findByText("legal.privacy"));
    expect(await screen.findByText("stub:/legal/$doc")).toBeTruthy();
  });
});

describe("LegalDocPage", () => {
  it("renders the document title and body", async () => {
    renderRoute(() => <LegalDocPage doc="terms" />, "/legal/$doc");
    expect(await screen.findByText("legald.terms")).toBeTruthy();
    expect(screen.getByText("legald.terms_body")).toBeTruthy();
  });

  it("redirects unknown documents back to the menu", async () => {
    renderRoute(() => <LegalDocPage doc="bogus" />, "/legal/$doc");
    expect(await screen.findByText("stub:/legal")).toBeTruthy();
  });

  it("navigates back to the legal menu", async () => {
    renderRoute(() => <LegalDocPage doc="conduct" />, "/legal/$doc");
    fireEvent.click(await screen.findByRole("button", {name: "nav.back"}));
    expect(await screen.findByText("stub:/legal")).toBeTruthy();
  });
});
