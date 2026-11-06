import {koboToNaira} from "@/lib/money";
import {apiClient} from "@/services/api-client";
import type {ApiListJobsResponse} from "@/types/api-types";
import type {JobOffer, JobsService} from "@/types/delivery-types";

/**
 * The jobs marketplace against `v1/courier/jobs?state=OFFERED`. The wire job carries no
 * route names, codes, distance, or deadlines — those fields stay empty until the API
 * returns them.
 */
export const httpJobsService: JobsService = {
  getJobs: async () => {
    const res = await apiClient.get("v1/courier/jobs", {searchParams: {state: "JOB_STATE_OFFERED"}}).json<ApiListJobsResponse>();
    return res.jobs.map((job): JobOffer => ({
      id: job.id,
      kind: "regular",
      origin: "",
      originCode: "",
      destination: "",
      destinationCode: "",
      payout: koboToNaira(job.earningsKobo),
      packages: 0,
      distanceKm: 0,
      pickupBy: "",
      deliverBy: "",
    }));
  },
  acceptJob: async (jobId) => {
    await apiClient.post(`v1/courier/jobs/${jobId}/accept`);
  },
  declineJob: async (jobId) => {
    await apiClient.post(`v1/courier/jobs/${jobId}/decline`);
  },
};
