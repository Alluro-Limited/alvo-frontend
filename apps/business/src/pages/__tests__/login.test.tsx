import {fireEvent, screen, waitFor} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {authService} from "@/services/auth-service";
import {createHttpError} from "@/test/http-error";
import {renderRoute} from "@/test/render-route";
import {LoginPage} from "../login";

vi.mock("@/services/auth-service", () => ({authService: {signIn: vi.fn()}}));

const signIn = vi.mocked(authService.signIn);

const renderLogin = () => renderRoute(LoginPage, "/");

const emailInput = () => screen.getByLabelText("login.email_label");
const passwordInput = () => screen.getByLabelText("login.password_label");
const submit = () => fireEvent.click(screen.getByRole("button", {name: "login.submit"}));

function fillCredentials(email = "ada@loopearls.com", password = "secret") {
  fireEvent.change(emailInput(), {target: {value: email}});
  fireEvent.change(passwordInput(), {target: {value: password}});
}

describe("LoginPage", () => {
  beforeEach(() => {
    signIn.mockReset();
  });

  it("renders the hero panel, both fields and the create-account link", async () => {
    renderLogin();

    expect(await screen.findByRole("heading", {level: 1, name: "login.title"})).toBeTruthy();
    expect(screen.getByText("login.description")).toBeTruthy();
    expect(screen.getByText("login.badge")).toBeTruthy();
    expect(screen.getByText("login.hero_title")).toBeTruthy();
    expect(emailInput().getAttribute("type")).toBe("email");
    expect(passwordInput().getAttribute("type")).toBe("password");
    expect(screen.getByRole("link", {name: "login.create_account"}).getAttribute("href")).toBe("/sign-up");
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("flags empty fields inline without calling the backend", async () => {
    renderLogin();
    await screen.findByRole("heading", {level: 1});

    submit();

    expect(screen.getByText("login.errors.email_required")).toBeTruthy();
    expect(screen.getByText("login.errors.password_required")).toBeTruthy();
    expect(emailInput().getAttribute("aria-invalid")).toBe("true");
    expect(emailInput().getAttribute("aria-describedby")).toBe(screen.getByText("login.errors.email_required").id);
    expect(signIn).not.toHaveBeenCalled();
  });

  it("rejects a malformed email before any request and clears the error once the field is edited", async () => {
    renderLogin();
    await screen.findByRole("heading", {level: 1});
    fillCredentials("not-an-email");

    submit();
    expect(screen.getByText("login.errors.email_invalid")).toBeTruthy();
    expect(signIn).not.toHaveBeenCalled();

    fireEvent.change(emailInput(), {target: {value: "ada@loopearls.com"}});
    expect(screen.queryByText("login.errors.email_invalid")).toBeNull();
    expect(emailInput().getAttribute("aria-invalid")).toBeNull();
  });

  it("disables and re-labels the login button with a spinner while signing in", async () => {
    signIn.mockReturnValue(new Promise(() => {}));
    renderLogin();
    await screen.findByRole("heading", {level: 1});
    fillCredentials();

    submit();

    const button = (await screen.findByRole("button", {name: "login.submitting"})) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    expect(screen.getByTestId("button-loader")).toBeTruthy();
    expect(signIn.mock.calls[0][0]).toEqual({email: "ada@loopearls.com", password: "secret"});
  });

  it("navigates to the dashboard once signed in", async () => {
    signIn.mockResolvedValue(undefined);
    renderLogin();
    await screen.findByRole("heading", {level: 1});
    fillCredentials();

    submit();

    expect(await screen.findByText("stub:/dashboard")).toBeTruthy();
  });

  it("puts wrong credentials under the password field, like the designed error state", async () => {
    signIn.mockRejectedValue(createHttpError(401));
    renderLogin();
    await screen.findByRole("heading", {level: 1});
    fillCredentials();

    submit();

    expect(await screen.findByText("login.errors.invalid_credentials")).toBeTruthy();
    expect(passwordInput().getAttribute("aria-invalid")).toBe("true");
    expect(screen.queryByRole("alert")).toBeNull();

    fireEvent.change(passwordInput(), {target: {value: "another"}});
    await waitFor(() => expect(screen.queryByText("login.errors.invalid_credentials")).toBeNull());
  });

  it.each([
    ["an outage", createHttpError(503), "login.errors.service_unavailable"],
    ["rate limiting", createHttpError(429), "login.errors.too_many_attempts"],
    ["a backend message", createHttpError(403, {message: "Account suspended."}), "Account suspended."],
  ])("shows an error alert for %s and clears it when the user edits a field", async (_case, error, message) => {
    signIn.mockRejectedValue(error);
    renderLogin();
    await screen.findByRole("heading", {level: 1});
    fillCredentials();

    submit();

    expect((await screen.findByRole("alert")).textContent).toBe(message);
    expect((screen.getByRole("button", {name: "login.submit"}) as HTMLButtonElement).disabled).toBe(false);

    fireEvent.change(emailInput(), {target: {value: "ada@other.com"}});
    await waitFor(() => expect(screen.queryByRole("alert")).toBeNull());
  });
});
