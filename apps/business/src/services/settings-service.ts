import type {SettingsService} from "@/types/settings-types";
import {httpSettingsService} from "./http-settings-service";
import {mockSettingsService} from "./mocks/mock-settings-service";

/**
 * Picks the settings service: the mock while `VITE_API_URL` is unset, HTTP otherwise.
 */
export const settingsService: SettingsService = import.meta.env.VITE_API_URL ? httpSettingsService : mockSettingsService;
