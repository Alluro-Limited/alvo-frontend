import type {SettingsService} from "@/types/settings-types";
import {httpSettingsService} from "./http-settings-service";

/** Settings against the real API. */
export const settingsService: SettingsService = httpSettingsService;
