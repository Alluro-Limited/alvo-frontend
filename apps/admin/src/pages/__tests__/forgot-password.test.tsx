import {fireEvent, screen, waitFor} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {authService} from "@/services/auth-service";
import {createHttpError} from "@/test/http-error";
import {renderRoute} from "@/test/render-route";
import {ForgotPasswordPage} from "../forgot-password";

vi.mock("@/lib/work-email-domains", () => ({workEmailDomains: ["alvo.com"]}));
vi.mock("@/services/auth-service", () => ({authService: {requestPasswordReset: vi.fn()}}));

const requestPasswordReset = vi.mocked(authService.requestPasswordReset);

const emailInput = () => screen.getByLabelText("auth.email_label");
const submit = () => fireEvent.click(screen.getByRole("button", {name: "forgot_password.submit"}));

async function renderPage() {
  const router = renderRoute(ForgotPasswordPage, "/forgot-password");
  await screen.findByRole("heading", {level: 1, name: "forgot_password.title"});
  return router;
}

describe("ForgotPasswordPage", () => {
  beforeEach(() => {
    requestPasswordReset.mockReset();
  });

  it("renders the recovery header, the email field and a way back to sign in", async () => {
    await renderPage();

    expect(screen.getByText("auth.recovery_eyebrow")).toBeTruthy();
    expect(screen.getByText("forgot_password.description")).toBeTruthy();
    expect(emailInput().getAttribute("placeholder")).toBe("forgot_password.email_placeholder");
    expect(screen.getByRole("button", {name: "auth.back_to_sign_in"}).getAttribute("href")).toBe("/");
  });

  it("asks for an email before sending anything", async () => {
    await renderPage();

    submit();

    expect(screen.getByText("forgot_password.errors.email_required")).toBeTruthy();
    expect(emailInput().getAttribute("aria-invalid")).toBe("true");
    expect(requestPasswordReset).not.toHaveBeenCalled();
  });

  it("rejects a non-work email before sending anything", async () => {
    await renderPage();
    fireEvent.change(emailInput(), {target: {value: "ada@gmail.com"}});

    submit();

    expect(screen.getByText("auth.errors.email_not_work")).toBeTruthy();
    expect(requestPasswordReset).not.toHaveBeenCalled();
  });

  it("shows the sending state, then the neutral confirmation, keeping the email in place", async () => {
    let resolve = () => {};
    requestPasswordReset.mockReturnValue(new Promise<void>((done) => (resolve = done)));
    await renderPage();
    fireEvent.change(emailInput(), {target: {value: "olatunji@Alvo.com"}});

    submit();

    const button = (await screen.findByRole("button", {name: "forgot_password.submitting"})) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    expect(requestPasswordReset.mock.calls[0][0]).toBe("olatunji@Alvo.com");

    resolve();
    expect((await screen.findByRole("status")).textContent).toBe("forgot_password.success");
    expect((emailInput() as HTMLInputElement).value).toBe("olatunji@Alvo.com");
  });

  it("shows an error alert when the request fails and clears it once the email is edited", async () => {
    requestPasswordReset.mockRejectedValue(createHttpError(429));
    await renderPage();
    fireEvent.change(emailInput(), {target: {value: "ada@alvo.com"}});

    submit();

    expect((await screen.findByRole("alert")).textContent).toBe("auth.errors.too_many_attempts");
    fireEvent.change(emailInput(), {target: {value: "ada@alvo.co"}});
    await waitFor(() => expect(screen.queryByRole("alert")).toBeNull());
  });
});
