import {generateSW} from "workbox-build";

/**
 * Generates `dist/client/sw.js` after `vp build`.
 *
 * vite-plugin-pwa skips service-worker generation when the resolved config has
 * `build.ssr` set, and TanStack Start builds every environment with ssr enabled,
 * so the plugin's closeBundle hook never runs here (vite-plugin-pwa#902). The
 * manifest and the `virtual:pwa-register` runtime still come from the plugin;
 * this script only produces the precache service worker they expect.
 */

const DIST_CLIENT = "dist/client";

const {count, size, warnings} = await generateSW({
  swDest: `${DIST_CLIENT}/sw.js`,
  globDirectory: DIST_CLIENT,
  globPatterns: ["**/*.{js,css,html,svg,png,ico,woff2}"],
  globIgnores: ["pwa-logo.svg", "sw.js"],
  // App-shell precache only: API responses are never cached so a user
  // always sees live job state after reconnecting.
  navigateFallback: "index.html",
  cleanupOutdatedCaches: true,
});

for (const warning of warnings) console.warn(`[pwa] ${warning}`);
console.log(`[pwa] Generated sw.js, precaching ${count} entries (${Math.round(size / 1024)} kB)`);
