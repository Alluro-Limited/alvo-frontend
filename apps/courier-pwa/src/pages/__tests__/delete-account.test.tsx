import {fireEvent, screen, waitFor} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {accountService} from "@/services/account-service";
import {createHttpError} from "@/test/http-error";
import {renderRoute} from "@/test/render-route";
import {DeleteAccountPage} from "../delete-account";

vi.mock("@/services/account-service", () => ({
  accountService: {
    getProfile: vi.fn(),
    getSupportContact: vi.fn(),
    signOut: vi.fn(),
    requestDeleteCode: vi.fn(),
    deleteAccount: vi.fn(),
    requestVehicleChange: vi.fn(),
  },
}));

const requestDeleteCode = vi.mocked(accountService.requestDeleteCode);
const deleteAccount = vi.mocked(accountService.deleteAccount);

const deleteButton = () => screen.getByRole("button", {name: "del.delete"});

async function tickBoth() {
  renderRoute(DeleteAccountPage, "/delete-account");
  fireEvent.click(await screen.findByRole("checkbox", {name: "del.check1"}));
  fireEvent.click(screen.getByRole("checkbox", {name: "del.check2"}));
}

async function openSheet() {
  await tickBoth();
  fireEvent.click(deleteButton());
  await screen.findByText("del.sheet_title");
}

describe("DeleteAccountPage", () => {
  beforeEach(() => {
    requestDeleteCode.mockReset().mockResolvedValue(undefined);
    deleteAccount.mockReset().mockResolvedValue(undefined);
  });

  it("keeps Delete account disabled until both boxes are ticked", async () => {
    renderRoute(DeleteAccountPage, "/delete-account");
    expect(await screen.findByText("del.title")).toBeTruthy();
    expect(screen.getByText(/del\.b1/)).toBeTruthy();
    expect(screen.getByText("del.irreversible")).toBeTruthy();
    expect(deleteButton()).toHaveProperty("disabled", true);
    fireEvent.click(screen.getByRole("checkbox", {name: "del.check1"}));
    expect(deleteButton()).toHaveProperty("disabled", true);
    fireEvent.click(screen.getByRole("checkbox", {name: "del.check2"}));
    expect(deleteButton()).toHaveProperty("disabled", false);
  });

  it("requests the OTP when the sheet opens", async () => {
    await openSheet();
    expect(requestDeleteCode).toHaveBeenCalledTimes(1);
    expect(screen.getByText("del.sheet_desc")).toBeTruthy();
  });

  it("confirms deletion with a complete code and lands on sign-in", async () => {
    await openSheet();
    fireEvent.change(screen.getByLabelText("auth.code_label"), {target: {value: "12345"}});
    fireEvent.click(screen.getByRole("button", {name: "del.confirm"}));
    await waitFor(() => expect(deleteAccount).toHaveBeenCalledWith("12345"));
    expect(await screen.findByText("stub:/sign-in")).toBeTruthy();
  });

  it("flags a wrong code instead of deleting", async () => {
    deleteAccount.mockRejectedValue(createHttpError(400));
    await openSheet();
    fireEvent.change(screen.getByLabelText("auth.code_label"), {target: {value: "00000"}});
    fireEvent.click(screen.getByRole("button", {name: "del.confirm"}));
    expect(await screen.findByText("del.err_code")).toBeTruthy();
    expect(screen.queryByText("stub:/sign-in")).toBeNull();
  });

  it("cancel on the sheet returns to the form without deleting", async () => {
    await openSheet();
    const cancelButtons = screen.getAllByRole("button", {name: "home.cancel"});
    fireEvent.click(cancelButtons[cancelButtons.length - 1]);
    await waitFor(() => expect(screen.queryByText("del.sheet_title")).toBeNull());
    expect(deleteAccount).not.toHaveBeenCalled();
    expect(screen.getByText("del.title")).toBeTruthy();
  });
});
