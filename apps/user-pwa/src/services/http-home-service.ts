import {apiClient} from "./api-client";
import type {AreaResult, HomeService, LockerDetail, LockerPin} from "@/types/home-types";

/** HTTP implementation for the home map + location endpoints. */
export const httpHomeService: HomeService = {
  getArea: () =>
    apiClient
      .get("users/area")
      .json<{area: string}>()
      .then((r) => r.area),
  setArea: (area) => apiClient.put("users/area", {json: {area}}).then(() => undefined),
  getLockers: () => apiClient.get("lockers").json<LockerPin[]>(),
  getLocker: (id) => apiClient.get(`lockers/${id}`).json<LockerDetail>(),
  searchAreas: (query) => apiClient.get("areas/search", {searchParams: {q: query}}).json<AreaResult[]>(),
};
