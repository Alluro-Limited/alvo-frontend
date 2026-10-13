import {fireEvent, screen, waitFor} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {signupService} from "@/services/signup-service";
import {renderRoute} from "@/test/render-route";
import {SignUpPage} from "../sign-up";

vi.mock("@/services/signup-service", () => ({signupService: {submitApplication: vi.fn()}}));

const submit = vi.mocked(signupService.submitApplication);

const comboboxes = () => screen.getAllByRole("combobox");

function fillPersonalStep() {
  fireEvent.change(screen.getByLabelText("su.first_name"), {target: {value: "Tunde"}});
  fireEvent.change(screen.getByLabelText("su.last_name"), {target: {value: "Bakare"}});
  fireEvent.change(screen.getByLabelText("su.phone"), {target: {value: "8012345678"}});
  fireEvent.change(screen.getByLabelText("su.email"), {target: {value: "tunde@example.com"}});
  fireEvent.change(screen.getByLabelText("su.nin"), {target: {value: "12345678901"}});
  const selects = comboboxes();
  fireEvent.change(selects[0], {target: {value: "male"}});
  fireEvent.change(selects[1], {target: {value: "1995"}});
  fireEvent.change(selects[2], {target: {value: "04"}});
  fireEvent.change(selects[3], {target: {value: "12"}});
}

async function reachPersonalStep() {
  renderRoute(SignUpPage, "/sign-up");
  fireEvent.click(await screen.findByRole("button", {name: "su.start"}));
  await screen.findByText("su.personal_title");
}

describe("SignUpPage", () => {
  beforeEach(() => {
    submit.mockReset();
    submit.mockResolvedValue({applicationId: "AG-1"});
  });

  it("shows the intro and advances to personal details", async () => {
    renderRoute(SignUpPage, "/sign-up");
    expect(await screen.findByText("su.intro_title")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "su.start"}));
    expect(await screen.findByText("su.personal_title")).toBeTruthy();
  });

  it("validates required fields on the personal step", async () => {
    await reachPersonalStep();
    fireEvent.click(screen.getByRole("button", {name: "su.continue"}));
    expect(await screen.findByText("su.err_first_name")).toBeTruthy();
    expect(screen.getByText("su.err_dob")).toBeTruthy();
    expect(screen.queryByText("su.exp_title")).toBeNull();
  });

  it("walks the whole wizard to the submitted screen", async () => {
    await reachPersonalStep();
    fillPersonalStep();
    fireEvent.click(screen.getByRole("button", {name: "su.continue"}));

    await screen.findByText("su.exp_title");
    fireEvent.change(comboboxes()[0], {target: {value: "no"}});
    fireEvent.click(screen.getByRole("button", {name: "su.continue"}));

    await screen.findByText("su.vehicle_title");
    fireEvent.click(screen.getByRole("button", {name: "su.continue"}));
    expect(await screen.findByText("su.err_vehicle_type")).toBeTruthy();
    fireEvent.change(comboboxes()[0], {target: {value: "motorcycle"}});
    fireEvent.change(screen.getByLabelText("su.brand"), {target: {value: "TVS"}});
    fireEvent.change(screen.getByLabelText("su.plate"), {target: {value: "ABC-123"}});
    const files = [new File(["x"], "vehicle.png"), new File(["x"], "license.png")];
    fireEvent.change(screen.getByLabelText("su.vehicle_photo"), {target: {files: [files[0]]}});
    fireEvent.change(screen.getByLabelText("su.license_photo"), {target: {files: [files[1]]}});
    fireEvent.click(screen.getByRole("button", {name: "su.continue"}));

    await screen.findByText("su.area_title");
    fireEvent.change(comboboxes()[0], {target: {value: "Yaba"}});
    fireEvent.click(screen.getByRole("button", {name: "su.submit"}));

    await waitFor(() => expect(submit).toHaveBeenCalled());
    expect(await screen.findByText("su.done_title")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "su.done"}));
    expect(await screen.findByText("stub:/sign-in")).toBeTruthy();
  });

  it("requires company and years only when the courier worked before", async () => {
    await reachPersonalStep();
    fillPersonalStep();
    fireEvent.click(screen.getByRole("button", {name: "su.continue"}));
    await screen.findByText("su.exp_title");

    fireEvent.change(comboboxes()[0], {target: {value: "yes"}});
    fireEvent.click(screen.getByRole("button", {name: "su.continue"}));
    expect(await screen.findByText("su.err_company")).toBeTruthy();
    expect(screen.getByText("su.err_years")).toBeTruthy();
    expect(screen.queryByText("su.err_worked_before")).toBeNull();
  });

  it("navigates back through steps and to onboarding from the intro", async () => {
    renderRoute(SignUpPage, "/sign-up");
    fireEvent.click(await screen.findByRole("button", {name: "su.start"}));
    await screen.findByText("su.personal_title");

    fireEvent.click(screen.getByRole("button", {name: "nav.back"}));
    expect(await screen.findByText("su.intro_title")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "nav.back"}));
    expect(await screen.findByText("stub:/onboarding")).toBeTruthy();
  });
});
