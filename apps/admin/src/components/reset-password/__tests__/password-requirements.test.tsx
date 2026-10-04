import {render, screen} from "@testing-library/react";
import {describe, expect, it} from "vite-plus/test";
import {PasswordRequirements} from "../password-requirements";

function chips() {
  return screen.getAllByRole("listitem").map((item) => [item.textContent, item.dataset.met]);
}

describe("PasswordRequirements", () => {
  it("shows every rule as an unmet chip for an empty password", () => {
    render(<PasswordRequirements password="" />);

    expect(chips()).toEqual([
      ["reset_password.rules.uppercasereset_password.rule_unmet", "false"],
      ["reset_password.rules.lowercasereset_password.rule_unmet", "false"],
      ["reset_password.rules.numberreset_password.rule_unmet", "false"],
      ["reset_password.rules.lengthreset_password.rule_unmet", "false"],
      ["reset_password.rules.symbolreset_password.rule_unmet", "false"],
    ]);
  });

  it("fills each chip the password satisfies", () => {
    render(<PasswordRequirements password="Password1" />);

    expect(chips().map(([, met]) => met)).toEqual(["true", "true", "true", "true", "false"]);
  });
});
