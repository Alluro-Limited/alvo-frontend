import {act, fireEvent, screen, waitFor} from "@testing-library/react";
import {afterEach, beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {authService} from "@/services/auth-service";
import {SIGN_IN_REDIRECT_DELAY_MS} from "@/components/sign-in/use-sign-in-form";
import {createHttpError} from "@/test/http-error";
import {renderRoute} from "@/test/render-route";
import {SignInPage} from "../sign-in";

vi.mock("@/lib/work-email-domains", () => ({workEmailDomains: ["alvo.com"]}));
vi.mock("@/services/auth-service", () => ({authService: {signIn: vi.fn()}}));

const signIn = vi.mocked(authService.signIn);

const renderSignIn = () => renderRoute(SignInPage, "/");

const emailInput = () => screen.getByLabelText("auth.email_label");
const passwordInput = () => screen.getByLabelText("sign_in.password_label");
const submit = () => fireEvent.click(screen.getByRole("button", {name: "sign_in.submit"}));

function fillCredentials(email = "olatunji@Alvo.com", password = "secret") {
  fireEvent.change(emailInput(), {target: {value: email}});
  fireEvent.change(passwordInput(), {target: {value: password}});
}

describe("SignInPage", () => {
  beforeEach(() => {
    signIn.mockReset();
  });
  afterEach(() => vi.useRealTimers());

  it("renders the portal heading, both fields and the forgot-password link", async () => {
    renderSignIn();

    expect(await screen.findByRole("heading", {level: 1, name: "sign_in.title"})).toBeTruthy();
    expect(screen.getByText("sign_in.portal")).toBeTruthy();
    expect(screen.getByText("sign_in.description")).toBeTruthy();
    expect(emailInput().getAttribute("type")).toBe("email");
    expect(passwordInput().getAttribute("type")).toBe("password");
    expect(screen.getByRole("button", {name: "sign_in.forgot_password"}).getAttribute("href")).toBe("/forgot-password");
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("flags empty fields inline without calling the backend", async () => {
    renderSignIn();
    await screen.findByRole("heading", {level: 1});

    submit();

    expect(screen.getByText("sign_in.errors.email_required")).toBeTruthy();
    expect(screen.getByText("sign_in.errors.password_required")).toBeTruthy();
    expect(emailInput().getAttribute("aria-invalid")).toBe("true");
    expect(emailInput().getAttribute("aria-describedby")).toBe(screen.getByText("sign_in.errors.email_required").id);
    expect(signIn).not.toHaveBeenCalled();
  });

  it("rejects a non-work email before any request and clears the error once the field is edited", async () => {
    renderSignIn();
    await screen.findByRole("heading", {level: 1});
    fillCredentials("ada@gmail.com");

    submit();
    expect(screen.getByText("auth.errors.email_not_work")).toBeTruthy();
    expect(signIn).not.toHaveBeenCalled();

    fireEvent.change(emailInput(), {target: {value: "ada@alvo.com"}});
    expect(screen.queryByText("auth.errors.email_not_work")).toBeNull();
    expect(emailInput().getAttribute("aria-invalid")).toBeNull();
  });

  it("disables and re-labels the login button with a spinner while signing in", async () => {
    signIn.mockReturnValue(new Promise(() => {}));
    renderSignIn();
    await screen.findByRole("heading", {level: 1});
    fillCredentials();

    submit();

    const button = (await screen.findByRole("button", {name: "sign_in.submitting"})) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    expect(screen.getByTestId("button-loader")).toBeTruthy();
    expect(signIn.mock.calls[0][0]).toEqual({email: "olatunji@Alvo.com", password: "secret"});
  });

  it("shows the success alert, then redirects to the dashboard", async () => {
    vi.useFakeTimers({shouldAdvanceTime: true});
    signIn.mockResolvedValue({accountStatus: "active"});
    const router = renderSignIn();
    await screen.findByRole("heading", {level: 1});
    fillCredentials();

    submit();

    expect((await screen.findByRole("status")).textContent).toBe("sign_in.success");
    expect((screen.getByRole("button", {name: "sign_in.submit"}) as HTMLButtonElement).disabled).toBe(true);
    expect(router.state.location.pathname).toBe("/");

    await act(() => vi.advanceTimersByTimeAsync(SIGN_IN_REDIRECT_DELAY_MS));
    await waitFor(() => expect(router.state.location.pathname).toBe("/dashboard"));
  });

  it("sends an invited admin straight to account setup, without the redirect notice", async () => {
    signIn.mockResolvedValue({accountStatus: "setup_required"});
    const router = renderSignIn();
    await screen.findByRole("heading", {level: 1});
    fillCredentials();

    submit();

    await waitFor(() => expect(router.state.location.pathname).toBe("/account-setup"));
    expect(screen.queryByRole("status")).toBeNull();
  });

  it.each([
    ["wrong credentials", createHttpError(401), "sign_in.errors.invalid_credentials"],
    ["an outage", createHttpError(503), "auth.errors.service_unavailable"],
    ["a backend message", createHttpError(403, {message: "Account suspended."}), "Account suspended."],
  ])("shows an error alert for %s and clears it when the user edits a field", async (_case, error, message) => {
    signIn.mockRejectedValue(error);
    renderSignIn();
    await screen.findByRole("heading", {level: 1});
    fillCredentials();

    submit();

    expect((await screen.findByRole("alert")).textContent).toBe(message);
    expect((screen.getByRole("button", {name: "sign_in.submit"}) as HTMLButtonElement).disabled).toBe(false);

    fireEvent.change(passwordInput(), {target: {value: "another"}});
    await waitFor(() => expect(screen.queryByRole("alert")).toBeNull());
  });
});
