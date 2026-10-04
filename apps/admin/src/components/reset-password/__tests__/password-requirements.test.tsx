import {render, screen} from "@testing-library/react";
import {describe, expect, it} from "vite-plus/test";
import {PasswordRequirements} from "../password-requirements";

function ruleState() {
  return screen.getAllByRole("listitem").map((item) => [item.textContent, item.dataset.met]);
}

describe("PasswordRequirements", () => {
  it("lists every rule as unmet for an empty password", () => {
    render(<PasswordRequirements password="" />);

    expect(screen.getByText("reset_password.rules_title")).toBeTruthy();
    expect(ruleState()).toEqual([
      ["reset_password.rules.lengthreset_password.rule_unmet", "false"],
      ["reset_password.rules.uppercasereset_password.rule_unmet", "false"],
      ["reset_password.rules.numberreset_password.rule_unmet", "false"],
      ["reset_password.rules.symbolreset_password.rule_unmet", "false"],
    ]);
  });

  it("ticks each rule the password satisfies", () => {
    render(<PasswordRequirements password="Password1" />);

    expect(ruleState().map(([, met]) => met)).toEqual(["true", "true", "true", "false"]);
  });
});
