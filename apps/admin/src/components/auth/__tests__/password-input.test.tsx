import {fireEvent, render, screen} from "@testing-library/react";
import {describe, expect, it} from "vite-plus/test";
import {PasswordInput} from "../password-input";

describe("PasswordInput", () => {
  it("masks the value until the visibility toggle is pressed, then masks it again", () => {
    render(<PasswordInput aria-label="password" defaultValue="secret" />);
    const input = screen.getByLabelText("password");

    expect(input.getAttribute("type")).toBe("password");

    fireEvent.click(screen.getByRole("button", {name: "auth.show_password"}));
    expect(input.getAttribute("type")).toBe("text");

    fireEvent.click(screen.getByRole("button", {name: "auth.hide_password"}));
    expect(input.getAttribute("type")).toBe("password");
  });

  it("does not submit the surrounding form when toggled", () => {
    let submitted = false;
    render(
      <form onSubmit={() => (submitted = true)}>
        <PasswordInput aria-label="password" />
      </form>
    );

    fireEvent.click(screen.getByRole("button", {name: "auth.show_password"}));

    expect(submitted).toBe(false);
  });
});
