import {render, screen} from "@testing-library/react";
import {describe, expect, it} from "vite-plus/test";
import {Dialog, DialogBackdrop, DialogDescription, DialogPopup, DialogPortal, DialogTitle} from "../dialog";

describe("Dialog", () => {
  it("renders the popup with its title and description", () => {
    render(
      <Dialog open>
        <DialogPortal>
          <DialogBackdrop />
          <DialogPopup>
            <DialogTitle>Welcome</DialogTitle>
            <DialogDescription>Hello there</DialogDescription>
          </DialogPopup>
        </DialogPortal>
      </Dialog>
    );

    expect(screen.getByRole("dialog", {name: "Welcome"})).toBeTruthy();
    expect(screen.getByText("Hello there")).toBeTruthy();
  });
});
