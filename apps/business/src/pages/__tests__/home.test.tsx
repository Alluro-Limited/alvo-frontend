import {render, screen} from "@testing-library/react";
import {describe, expect, it} from "vite-plus/test";
import {HomePage} from "../home";

describe("HomePage", () => {
  it("renders the title as the page heading and the description", () => {
    render(<HomePage />);

    expect(screen.getByRole("heading", {level: 1, name: "home.title"})).toBeTruthy();
    expect(screen.getByText("home.description")).toBeTruthy();
  });
});
