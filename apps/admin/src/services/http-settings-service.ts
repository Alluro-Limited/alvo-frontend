import * as v from "valibot";
import {apiClient} from "@/services/api-client";
import type {SettingsService} from "@/types/settings-types";

const SettingsSchema = v.object({
  general: v.object({platformName: v.string(), timezone: v.string(), dateFormat: v.string()}),
  courierPayout: v.object({dueBufferDays: v.number(), autoWithholdFlagged: v.boolean(), dateFormat: v.string()}),
  notifications: v.object({
    adminActions: v.boolean(),
    payoutCycleApproaching: v.boolean(),
    nodeDowntime: v.boolean(),
    payoutProcessed: v.boolean(),
    criticalSystem: v.boolean(),
  }),
  security: v.object({
    sessionTimeoutMinutes: v.number(),
    enforceTwoFactor: v.boolean(),
    passwordExpiryDays: v.number(),
    maxLoginAttempts: v.number(),
  }),
});

const ResponseSchema = v.object({
  settings: SettingsSchema,
  options: v.object({timezones: v.array(v.string()), dateFormats: v.array(v.string())}),
});

/** Ky adapter for the platform settings API — active when `VITE_API_URL` is set. */
export const httpSettingsService: SettingsService = {
  getSettings: async () => v.parse(ResponseSchema, await apiClient.get("settings").json()),
  updateSettings: async (settings) => v.parse(SettingsSchema, await apiClient.put("settings", {json: settings}).json()),
};
