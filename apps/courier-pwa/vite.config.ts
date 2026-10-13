import {resolve} from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import {sentryVitePlugin} from "@sentry/vite-plugin";
import {tanstackStart} from "@tanstack/react-start/plugin/vite";
import {defineConfig, lazyPlugins} from "vite-plus";
import {VitePWA} from "vite-plugin-pwa";
import {createParaglidePlugin} from "./paraglide.config.ts";

// Source maps are uploaded only when a token is present (Vercel production), so
// local and preview builds never need Sentry credentials.
const sentryPlugins = process.env.SENTRY_AUTH_TOKEN
  ? [
      sentryVitePlugin({
        org: process.env.SENTRY_ORG,
        project: process.env.SENTRY_PROJECT,
        authToken: process.env.SENTRY_AUTH_TOKEN,
        sourcemaps: {
          assets: "./dist/**",
          filesToDeleteAfterUpload: ["./dist/**/*.js.map", "./dist/**/*.css.map"],
        },
      }),
    ]
  : [];

export default defineConfig({
  // Lazy so `vp check`/`vp lint` at the repo root can read this config without
  // TanStack Start resolving src/ against the wrong working directory.
  plugins: lazyPlugins(() => [
    createParaglidePlugin(),
    tanstackStart({
      // Every courier screen sits behind sign-in, so only the SPA shell is prerendered.
      spa: {
        enabled: true,
        prerender: {
          enabled: true,
          crawlLinks: false,
          outputPath: "index.html",
        },
      },
      router: {
        quoteStyle: "double",
        routeFileIgnorePattern: "(^|/)__tests__/|\\.test\\.(ts|tsx)$",
      },
    }),
    react({compiler: true}),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg"],
      manifest: {
        name: "Alvo Go",
        short_name: "Alvo Go",
        description: "Alvo courier companion",
        theme_color: "#00a996",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        scope: "/",
        icons: [
          {src: "pwa-64x64.png", sizes: "64x64", type: "image/png"},
          {src: "pwa-192x192.png", sizes: "192x192", type: "image/png"},
          {src: "pwa-512x512.png", sizes: "512x512", type: "image/png"},
          {src: "maskable-icon-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable"},
        ],
      },
      devOptions: {
        // The service worker also runs in dev so install/offline behavior is testable locally.
        enabled: true,
      },
      // SW generation is skipped by the plugin under TanStack Start (build.ssr is
      // true for every environment); scripts/generate-sw.ts produces it after build.
    }),
    ...sentryPlugins,
  ]),
  resolve: {
    alias: {
      "@": resolve(import.meta.dirname, "./src"),
    },
  },
  build: {
    target: "es2022",
    sourcemap: true,
  },
});
