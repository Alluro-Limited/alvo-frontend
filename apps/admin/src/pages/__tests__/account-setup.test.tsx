import {fireEvent, screen, waitFor} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {authService} from "@/services/auth-service";
import {createHttpError} from "@/test/http-error";
import {renderRoute} from "@/test/render-route";
import {AccountSetupPage} from "../account-setup";

vi.mock("@/services/auth-service", () => ({authService: {getAccountSetup: vi.fn(), completeAccountSetup: vi.fn()}}));

const getAccountSetup = vi.mocked(authService.getAccountSetup);
const completeAccountSetup = vi.mocked(authService.completeAccountSetup);

const invitation = {invitedBy: "Dayo Ogunseye", roleLabel: "Business analyst · Read-only finance"};

const renderSetup = () => renderRoute(AccountSetupPage, "/account-setup");

/** The button only exists once the invitation has loaded, so it doubles as the "form ready" signal. */
const waitForForm = () => screen.findByRole("button", {name: "account_setup.submit"});

const firstNameInput = () => screen.getByLabelText("account_setup.first_name_label");
const lastNameInput = () => screen.getByLabelText("account_setup.last_name_label");
const passwordInput = () => screen.getByLabelText("account_setup.password_label");
const submit = () => fireEvent.click(screen.getByRole("button", {name: "account_setup.submit"}));

function fillForm() {
  fireEvent.change(firstNameInput(), {target: {value: "Ada"}});
  fireEvent.change(lastNameInput(), {target: {value: "Lovelace"}});
  fireEvent.change(passwordInput(), {target: {value: "Passw0rd!"}});
}

describe("AccountSetupPage", () => {
  beforeEach(() => {
    getAccountSetup.mockReset();
    completeAccountSetup.mockReset();
    getAccountSetup.mockResolvedValue(invitation);
  });

  it("shows a skeleton shaped like the form while the invitation loads", async () => {
    getAccountSetup.mockReturnValue(new Promise(() => {}));
    renderSetup();

    const status = await screen.findByRole("status");
    expect(status.getAttribute("aria-busy")).toBe("true");
    expect(screen.queryByRole("button", {name: "account_setup.submit"})).toBeNull();
  });

  it("renders the header, the inviter's name highlighted, the role and the submit button", async () => {
    renderSetup();

    expect(await screen.findByRole("heading", {level: 1, name: "account_setup.title"})).toBeTruthy();
    await waitForForm();
    expect(screen.getByText("account_setup.eyebrow")).toBeTruthy();
    const inviter = screen.getByText("Dayo Ogunseye");
    expect(inviter.className).toContain("font-bold");
    expect(inviter.className).toContain("text-primary-700");
    expect(screen.getByText("Business analyst · Read-only finance")).toBeTruthy();
    expect(screen.getByText("account_setup.role_hint")).toBeTruthy();
    expect(screen.getByRole("button", {name: "account_setup.submit"})).toBeTruthy();
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("flags the three required fields inline without calling the backend", async () => {
    renderSetup();
    await waitForForm();

    submit();

    expect(screen.getByText("account_setup.errors.first_name_required")).toBeTruthy();
    expect(screen.getByText("account_setup.errors.last_name_required")).toBeTruthy();
    expect(screen.getByText("account_setup.errors.password_required")).toBeTruthy();
    expect(firstNameInput().getAttribute("aria-invalid")).toBe("true");
    expect(completeAccountSetup).not.toHaveBeenCalled();

    fireEvent.change(firstNameInput(), {target: {value: "Ada"}});
    expect(screen.queryByText("account_setup.errors.first_name_required")).toBeNull();
  });

  it("activates the account and lands on the dashboard", async () => {
    const router = renderSetup();
    await waitForForm();
    fillForm();

    submit();

    await waitFor(() =>
      expect(completeAccountSetup.mock.calls[0][0]).toEqual({firstName: "Ada", lastName: "Lovelace", password: "Passw0rd!"})
    );
    await waitFor(() => expect(router.state.location.pathname).toBe("/dashboard"));
  });

  it("disables and re-labels the button with a spinner while activating", async () => {
    completeAccountSetup.mockReturnValue(new Promise(() => {}));
    renderSetup();
    await waitForForm();
    fillForm();

    submit();

    const button = (await screen.findByRole("button", {name: "account_setup.submitting"})) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    expect(screen.getByTestId("button-loader")).toBeTruthy();
  });

  it.each([
    ["an expired invitation", createHttpError(410), "account_setup.errors.invitation_expired"],
    ["an outage", createHttpError(503), "auth.errors.service_unavailable"],
    ["a backend message", createHttpError(400, {message: "Invitation already used."}), "Invitation already used."],
  ])("shows an alert for %s and keeps the form usable", async (_case, error, message) => {
    completeAccountSetup.mockRejectedValue(error);
    renderSetup();
    await waitForForm();
    fillForm();

    submit();

    expect((await screen.findByRole("alert")).textContent).toBe(message);
    expect((screen.getByRole("button", {name: "account_setup.submit"}) as HTMLButtonElement).disabled).toBe(false);

    fireEvent.change(lastNameInput(), {target: {value: "Hopper"}});
    await waitFor(() => expect(screen.queryByRole("alert")).toBeNull());
  });

  it("shows an error alert and a way back to sign-in when the invitation cannot be loaded", async () => {
    getAccountSetup.mockRejectedValue(createHttpError(503));
    renderSetup();

    expect((await screen.findByRole("alert")).textContent).toBe("auth.errors.service_unavailable");
    expect(screen.getByRole("button", {name: "auth.back_to_sign_in"}).getAttribute("href")).toBe("/");
    expect(screen.queryByRole("button", {name: "account_setup.submit"})).toBeNull();
  });
});
