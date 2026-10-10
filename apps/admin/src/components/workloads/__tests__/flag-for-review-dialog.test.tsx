import {fireEvent, render, screen} from "@testing-library/react";
import {describe, expect, it, vi} from "vite-plus/test";
import {FlagForReviewDialog} from "../flag-for-review-dialog";

function renderDialog(overrides: Partial<Parameters<typeof FlagForReviewDialog>[0]> = {}) {
  const props = {open: true, parcelIds: ["PRV-88183"], submitting: false, failed: false, onClose: vi.fn(), onSubmit: vi.fn(), ...overrides};
  render(<FlagForReviewDialog {...props} />);
  return props;
}

describe("FlagForReviewDialog", () => {
  it("keeps confirm disabled until a reason is picked", () => {
    renderDialog();
    const confirm = screen.getByRole("button", {name: "workloads.flag_confirm"}) as HTMLButtonElement;
    expect(confirm.disabled).toBe(true);

    fireEvent.change(screen.getByRole("combobox"), {target: {value: "damaged_item"}});
    expect(confirm.disabled).toBe(false);
  });

  it("submits the reason and trimmed notes", () => {
    const props = renderDialog();
    fireEvent.change(screen.getByRole("combobox"), {target: {value: "lost_package"}});
    fireEvent.change(screen.getByRole("textbox"), {target: {value: "  gone missing  "}});
    fireEvent.click(screen.getByRole("button", {name: "workloads.flag_confirm"}));

    expect(props.onSubmit).toHaveBeenCalledWith("lost_package", "gone missing");
  });

  it("shows the bulk title when flagging multiple parcels", () => {
    renderDialog({parcelIds: ["PRV-1", "PRV-2", "PRV-3"]});
    expect(screen.getByText("workloads.flag_modal_multi_title")).toBeTruthy();
  });

  it("relables the confirm button while submitting and shows errors inline", () => {
    renderDialog({submitting: true, failed: true});
    expect(screen.getByRole("button", {name: "workloads.flag_confirm_loading"})).toBeTruthy();
    expect(screen.getByText("workloads.flag_error")).toBeTruthy();
  });
});
