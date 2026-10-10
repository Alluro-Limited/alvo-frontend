import {render, screen} from "@testing-library/react";
import {describe, expect, it} from "vite-plus/test";
import {Button} from "../button";

describe("Button", () => {
  it("renders its label and start icon when idle", () => {
    render(<Button startIcon={<span data-testid="start-icon" />}>Login</Button>);

    const button = screen.getByRole("button", {name: "Login"}) as HTMLButtonElement;
    expect(button.disabled).toBe(false);
    expect(button.getAttribute("aria-busy")).toBeNull();
    expect(screen.getByTestId("start-icon")).toBeTruthy();
    expect(screen.queryByTestId("button-loader")).toBeNull();
  });

  it("disables the button, swaps the start icon for a spinner and keeps the caller's label while loading", () => {
    render(
      <Button isLoading startIcon={<span data-testid="start-icon" />}>
        Logging in…
      </Button>
    );

    const button = screen.getByRole("button", {name: "Logging in…"}) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    expect(button.getAttribute("aria-busy")).toBe("true");
    expect(screen.getByTestId("button-loader")).toBeTruthy();
    expect(screen.queryByTestId("start-icon")).toBeNull();
  });

  it("is disabled for the disabled variant", () => {
    render(<Button variant="disabled">Login</Button>);

    expect((screen.getByRole("button", {name: "Login"}) as HTMLButtonElement).disabled).toBe(true);
  });
});
