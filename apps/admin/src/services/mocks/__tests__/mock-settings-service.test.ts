import {describe, expect, it} from "vite-plus/test";
import {mockSettingsService} from "../mock-settings-service";

describe("mockSettingsService", () => {
  it("returns settings grouped by section plus select options", async () => {
    const res = await mockSettingsService.getSettings();
    expect(res.settings.general.platformName).toBeTruthy();
    expect(res.settings.courierPayout.dueBufferDays).toBeGreaterThan(0);
    expect(Object.keys(res.settings.notifications).length).toBe(5);
    expect(res.options.timezones.length).toBeGreaterThan(0);
    expect(res.options.dateFormats.length).toBeGreaterThan(0);
  });

  it("persists updates and returns the saved copy", async () => {
    const {settings} = await mockSettingsService.getSettings();
    const next = {...settings, general: {...settings.general, platformName: "Alvo Express"}};
    const saved = await mockSettingsService.updateSettings(next);
    expect(saved.general.platformName).toBe("Alvo Express");
    const again = await mockSettingsService.getSettings();
    expect(again.settings.general.platformName).toBe("Alvo Express");
    // Restore the default for other tests.
    await mockSettingsService.updateSettings(settings);
  });
});
