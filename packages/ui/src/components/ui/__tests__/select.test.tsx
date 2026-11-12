import {fireEvent, render, screen} from "@testing-library/react";
import {describe, expect, it, vi} from "vite-plus/test";
import {
  Select,
  SelectIcon,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPopup,
  SelectPortal,
  SelectPositioner,
  SelectTrigger,
  SelectValue,
} from "../select";

const ITEMS = [
  {value: "sme", label: "SME / Small business"},
  {value: "retail", label: "Retail"},
];

function renderSelect(value: string | null = null, onValueChange = () => {}) {
  return render(
    <Select name="kind" items={ITEMS} value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select business type" />
        <SelectIcon />
      </SelectTrigger>
      <SelectPortal>
        <SelectPositioner>
          <SelectPopup>
            {ITEMS.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                <SelectItemText>{item.label}</SelectItemText>
                <SelectItemIndicator />
              </SelectItem>
            ))}
          </SelectPopup>
        </SelectPositioner>
      </SelectPortal>
    </Select>
  );
}

describe("Select", () => {
  it("shows the placeholder until a value is chosen", () => {
    renderSelect();

    const trigger = screen.getByRole("combobox");
    expect(trigger.getAttribute("data-placeholder")).not.toBeNull();
    expect(trigger.textContent).toContain("Select business type");
  });

  it("opens the popup and reports the picked item", () => {
    const onValueChange = vi.fn();
    renderSelect(null, onValueChange);

    fireEvent.click(screen.getByRole("combobox"));
    const option = screen.getByRole("option", {name: "Retail"});
    fireEvent.pointerDown(option);
    fireEvent.click(option);

    expect(onValueChange).toHaveBeenCalledWith("retail", expect.anything());
  });

  it("renders the selected item's label in the trigger", () => {
    renderSelect("sme");

    expect(screen.getByRole("combobox").textContent).toContain("SME / Small business");
  });
});
