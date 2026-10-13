import {registerSW} from "virtual:pwa-register";

let registered = false;

/**
 * Registers the generated service worker and reloads when a new version takes
 * control, so an open tab never runs a mix of old and new chunks.
 */
export function startServiceWorker(): void {
  if (registered || typeof window === "undefined") return;
  registered = true;
  registerSW({immediate: true});
}
