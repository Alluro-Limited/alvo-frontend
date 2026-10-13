import {fireEvent, screen, waitFor} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {jobsService} from "@/services/jobs-service";
import {renderRoute} from "@/test/render-route";
import type {JobOffer} from "@/types/delivery-types";
import {JobsPage} from "../jobs";

vi.mock("@/services/jobs-service", () => ({
  jobsService: {getJobs: vi.fn(), acceptJob: vi.fn(), declineJob: vi.fn()},
}));

const getJobs = vi.mocked(jobsService.getJobs);
const acceptJob = vi.mocked(jobsService.acceptJob);
const declineJob = vi.mocked(jobsService.declineJob);

function offer(id: string, kind: JobOffer["kind"] = "regular"): JobOffer {
  return {
    id,
    kind,
    origin: "Oshodi",
    originCode: "P011",
    destination: "Lekki",
    destinationCode: "P012",
    payout: 5400,
    packages: 32,
    distanceKm: 3.4,
    pickupBy: "4:50PM",
    deliverBy: "6:25PM",
  };
}

describe("JobsPage", () => {
  beforeEach(() => {
    getJobs.mockReset();
    acceptJob.mockReset().mockResolvedValue(undefined);
    declineJob.mockReset().mockResolvedValue(undefined);
  });

  it("shows offers with route, payout and meta", async () => {
    getJobs.mockResolvedValue([offer("PRI-4728123780")]);
    renderRoute(JobsPage, "/jobs");
    expect(await screen.findByText("PRI-4728123780")).toBeTruthy();
    expect(screen.getByText("₦5,400")).toBeTruthy();
    expect(screen.getByText(/Oshodi/)).toBeTruthy();
    expect(screen.getByRole("button", {name: "home.decline"})).toBeTruthy();
  });

  it("filters offers by kind", async () => {
    getJobs.mockResolvedValue([offer("PRI-1"), offer("SPD-1", "speed")]);
    renderRoute(JobsPage, "/jobs");
    expect(await screen.findByText("PRI-1")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "jobs.regular"}));
    expect(screen.queryByText("SPD-1")).toBeNull();
    fireEvent.click(screen.getByRole("button", {name: "jobs.speed"}));
    expect(screen.queryByText("PRI-1")).toBeNull();
    expect(screen.getByText("SPD-1")).toBeTruthy();
  });

  it("shows the empty state when no offers remain", async () => {
    getJobs.mockResolvedValue([]);
    renderRoute(JobsPage, "/jobs");
    expect(await screen.findByText("jobs.none")).toBeTruthy();
  });

  it("declines an offer without the confirm dialog", async () => {
    getJobs.mockResolvedValue([offer("PRI-1")]);
    renderRoute(JobsPage, "/jobs");
    fireEvent.click(await screen.findByRole("button", {name: "home.decline"}));
    await waitFor(() => expect(declineJob).toHaveBeenCalledWith("PRI-1"));
  });

  it("accepts through the confirm dialog and navigates to the delivery", async () => {
    getJobs.mockResolvedValue([offer("PRI-1")]);
    renderRoute(JobsPage, "/jobs");
    fireEvent.click(await screen.findByRole("button", {name: "home.accept"}));
    const confirm = await screen.findByRole("button", {name: "home.confirm_accept"});
    expect((confirm as HTMLButtonElement).disabled).toBe(true);
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(confirm);
    await waitFor(() => expect(acceptJob).toHaveBeenCalledWith("PRI-1"));
    expect(await screen.findByText("stub:/deliveries/$jobId")).toBeTruthy();
  });
});
