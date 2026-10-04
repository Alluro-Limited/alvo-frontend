import {render, screen} from "@testing-library/react";
import {describe, expect, it} from "vite-plus/test";
import {AuthAlert} from "../auth-alert";

describe("AuthAlert", () => {
  it("announces errors assertively", () => {
    render(<AuthAlert tone="error">Invalid email or password.</AuthAlert>);

    const alert = screen.getByRole("alert");
    expect(alert.textContent).toBe("Invalid email or password.");
    expect(alert.dataset.tone).toBe("error");
  });

  it("announces success politely", () => {
    render(<AuthAlert tone="success">Redirecting…</AuthAlert>);

    const status = screen.getByRole("status");
    expect(status.textContent).toBe("Redirecting…");
    expect(status.dataset.tone).toBe("success");
  });
});
