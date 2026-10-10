import type {SettingsService} from "@/types/settings-types";
import {httpSettingsService} from "./http-settings-service";
import {mockSettingsService} from "./mocks/mock-settings-service";

/** Platform settings service — real HTTP API when `VITE_API_URL` is set, deterministic mock otherwise. */
export const settingsService: SettingsService = import.meta.env.VITE_API_URL ? httpSettingsService : mockSettingsService;
