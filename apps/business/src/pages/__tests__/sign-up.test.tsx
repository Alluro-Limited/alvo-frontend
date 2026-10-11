import {fireEvent, screen, waitFor} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {authService} from "@/services/auth-service";
import {createHttpError} from "@/test/http-error";
import {renderRoute} from "@/test/render-route";
import {SignUpPage} from "../sign-up";

vi.mock("@/services/auth-service", () => ({
  authService: {signIn: vi.fn(), signUp: vi.fn(), verifyEmail: vi.fn(), resendVerificationCode: vi.fn()},
}));

const signUp = vi.mocked(authService.signUp);
const verifyEmail = vi.mocked(authService.verifyEmail);
const resendVerificationCode = vi.mocked(authService.resendVerificationCode);

const renderSignUp = () => renderRoute(SignUpPage, "/sign-up");

const nameInput = () => screen.getByLabelText("sign_up.business_name_label");
const typeSelect = () => screen.getByLabelText("sign_up.business_type_label");
const businessPhoneInput = () => screen.getByLabelText("sign_up.business_phone_label");
const businessEmailInput = () => screen.getByLabelText("sign_up.business_email_label");
const continueButton = () => screen.getByRole("button", {name: "sign_up.continue"});

function fillBusinessInfo() {
  fireEvent.change(nameInput(), {target: {value: "Loop Earls"}});
  fireEvent.change(typeSelect(), {target: {value: "sme"}});
  fireEvent.change(businessPhoneInput(), {target: {value: "+234 800 123 4567"}});
  fireEvent.change(businessEmailInput(), {target: {value: "ops@loopearls.com"}});
}

async function advanceToPersonal() {
  fillBusinessInfo();
  fireEvent.click(continueButton());
  await screen.findByRole("heading", {level: 1, name: "sign_up.personal_title"});
}

function fillPersonalDetails() {
  fireEvent.change(screen.getByLabelText("sign_up.first_name_label"), {target: {value: "Ada"}});
  fireEvent.change(screen.getByLabelText("sign_up.last_name_label"), {target: {value: "Obi"}});
  fireEvent.change(screen.getByLabelText("sign_up.phone_label"), {target: {value: "0800 123 4567"}});
  fireEvent.change(screen.getByLabelText("sign_up.email_label"), {target: {value: "ada@loopearls.com"}});
  fireEvent.change(screen.getByLabelText("sign_up.password_label"), {target: {value: "Password123!"}});
}

async function advanceToVerify() {
  fillPersonalDetails();
  fireEvent.click(continueButton());
  await screen.findByRole("heading", {level: 1, name: "sign_up.verify_title"});
}

const codeInputs = () => screen.getAllByRole("textbox") as HTMLInputElement[];

function fillCode(digits: string) {
  for (const [index, digit] of [...digits].entries()) {
    fireEvent.change(codeInputs()[index]!, {target: {value: digit}});
  }
}

describe("SignUpPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    signUp.mockResolvedValue(undefined);
    verifyEmail.mockResolvedValue(undefined);
    resendVerificationCode.mockResolvedValue(undefined);
  });

  it("renders step 1 with the progress panel and all four fields", async () => {
    renderSignUp();

    expect(await screen.findByRole("heading", {level: 1, name: "sign_up.business_title"})).toBeTruthy();
    for (const label of ["sign_up.step_business", "sign_up.step_contact", "sign_up.step_verification"]) {
      expect(screen.getByText(label)).toBeTruthy();
    }
    expect(screen.getByRole("link", {name: "sign_up.home"}).getAttribute("href")).toBe("/");
    expect(screen.getByRole("link", {name: "sign_up.sign_in"}).getAttribute("href")).toBe("/");
    expect(nameInput()).toBeTruthy();
    expect(typeSelect()).toBeTruthy();
    expect(businessPhoneInput().getAttribute("type")).toBe("tel");
    expect(businessEmailInput().getAttribute("type")).toBe("email");
  });

  it("flags empty business fields inline without calling the backend", async () => {
    renderSignUp();
    await screen.findByRole("heading", {level: 1});

    fireEvent.click(continueButton());

    expect(screen.getByText("sign_up.errors.field_required")).toBeTruthy();
    expect(screen.getByText("sign_up.errors.business_type_required")).toBeTruthy();
    expect(screen.getByText("sign_up.errors.business_phone_invalid")).toBeTruthy();
    expect(screen.getByText("sign_up.errors.business_email_invalid")).toBeTruthy();
    expect(nameInput().getAttribute("aria-invalid")).toBe("true");
    expect(signUp).not.toHaveBeenCalled();
  });

  it("rejects a malformed business email and clears the error on edit", async () => {
    renderSignUp();
    await screen.findByRole("heading", {level: 1});
    fillBusinessInfo();
    fireEvent.change(businessEmailInput(), {target: {value: "not-an-email"}});

    fireEvent.click(continueButton());
    expect(screen.getByText("sign_up.errors.business_email_invalid")).toBeTruthy();

    fireEvent.change(businessEmailInput(), {target: {value: "ops@loopearls.com"}});
    expect(screen.queryByText("sign_up.errors.business_email_invalid")).toBeNull();
    expect(businessEmailInput().getAttribute("aria-invalid")).toBeNull();
  });

  it("advances to personal details with a valid business step", async () => {
    renderSignUp();
    await screen.findByRole("heading", {level: 1});

    await advanceToPersonal();

    expect(screen.getByText("sign_up.terms_of_service")).toBeTruthy();
    expect(screen.getByText("sign_up.privacy_policy")).toBeTruthy();
    expect(screen.getByLabelText("sign_up.password_label").getAttribute("type")).toBe("password");
    expect(signUp).not.toHaveBeenCalled();
  });

  it("flags empty personal fields and a short password", async () => {
    renderSignUp();
    await screen.findByRole("heading", {level: 1});
    await advanceToPersonal();

    fireEvent.click(continueButton());
    for (const key of ["first_name_required", "last_name_required", "phone_invalid", "email_invalid", "password_required"]) {
      expect(screen.getByText(`sign_up.errors.${key}`)).toBeTruthy();
    }

    fillPersonalDetails();
    fireEvent.change(screen.getByLabelText("sign_up.password_label"), {target: {value: "short"}});
    fireEvent.click(continueButton());
    expect(screen.getByText("sign_up.errors.password_min")).toBeTruthy();
    expect(signUp).not.toHaveBeenCalled();
  });

  it("toggles the password visibility like the login form", async () => {
    renderSignUp();
    await screen.findByRole("heading", {level: 1});
    await advanceToPersonal();

    const password = screen.getByLabelText("sign_up.password_label");
    expect(password.getAttribute("type")).toBe("password");
    fireEvent.click(screen.getByRole("button", {name: "auth.show_password"}));
    expect(password.getAttribute("type")).toBe("text");
    fireEvent.click(screen.getByRole("button", {name: "auth.hide_password"}));
    expect(password.getAttribute("type")).toBe("password");
  });

  it("submits both steps together and advances to verification", async () => {
    renderSignUp();
    await screen.findByRole("heading", {level: 1});
    await advanceToPersonal();
    await advanceToVerify();

    expect(signUp.mock.calls[0]?.[0]).toEqual({
      businessName: "Loop Earls",
      businessType: "sme",
      businessPhone: "+234 800 123 4567",
      businessEmail: "ops@loopearls.com",
      firstName: "Ada",
      lastName: "Obi",
      phone: "0800 123 4567",
      email: "ada@loopearls.com",
      password: "Password123!",
    });
    expect(codeInputs()).toHaveLength(5);
    expect(screen.getByText("sign_up.no_code")).toBeTruthy();
  });

  it("shows a form-level alert when sign-up fails and clears it on edit", async () => {
    signUp.mockRejectedValue(createHttpError(409));
    renderSignUp();
    await screen.findByRole("heading", {level: 1});
    await advanceToPersonal();
    fillPersonalDetails();

    fireEvent.click(continueButton());

    expect((await screen.findByRole("alert")).textContent).toBe("sign_up.errors.email_taken");
    fireEvent.change(screen.getByLabelText("sign_up.email_label"), {target: {value: "other@loopearls.com"}});
    await waitFor(() => expect(screen.queryByRole("alert")).toBeNull());
  });

  it("keeps the verify button disabled until all five digits are entered", async () => {
    renderSignUp();
    await screen.findByRole("heading", {level: 1});
    await advanceToPersonal();
    await advanceToVerify();

    const button = screen.getByRole("button", {name: "sign_up.verify_submit"}) as HTMLButtonElement;
    expect(button.disabled).toBe(true);

    fillCode("12345");
    expect(button.disabled).toBe(false);
  });

  it("shows the designed banner on a wrong code and clears it when typing again", async () => {
    verifyEmail.mockRejectedValue(createHttpError(400));
    renderSignUp();
    await screen.findByRole("heading", {level: 1});
    await advanceToPersonal();
    await advanceToVerify();

    fillCode("99999");
    fireEvent.click(screen.getByRole("button", {name: "sign_up.verify_submit"}));

    const banner = await screen.findByRole("alert");
    expect(banner.textContent).toContain("sign_up.errors.incorrect_code_title");
    expect(banner.textContent).toContain("sign_up.errors.incorrect_code_body");

    fireEvent.change(codeInputs()[0]!, {target: {value: "1"}});
    await waitFor(() => expect(screen.queryByRole("alert")).toBeNull());
  });

  it("verifies a valid code and shows the success status", async () => {
    renderSignUp();
    await screen.findByRole("heading", {level: 1});
    await advanceToPersonal();
    await advanceToVerify();

    fillCode("12345");
    fireEvent.click(screen.getByRole("button", {name: "sign_up.verify_submit"}));

    expect((await screen.findByRole("status")).textContent).toBe("sign_up.verify_success");
    expect(verifyEmail.mock.calls[0]?.[0]).toBe("12345");
  });

  it("resends the code and reports it was sent", async () => {
    renderSignUp();
    await screen.findByRole("heading", {level: 1});
    await advanceToPersonal();
    await advanceToVerify();

    fireEvent.click(screen.getByRole("button", {name: "sign_up.resend"}));

    await waitFor(() => expect(resendVerificationCode).toHaveBeenCalledTimes(1));
    expect(await screen.findByRole("button", {name: "sign_up.resent"})).toBeTruthy();
  });
});
