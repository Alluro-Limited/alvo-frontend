import {resolve} from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import {sentryVitePlugin} from "@sentry/vite-plugin";
import {tanstackStart} from "@tanstack/react-start/plugin/vite";
import {defineConfig, lazyPlugins} from "vite-plus";
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
      // Every admin page sits behind sign-in, so only the SPA shell is prerendered.
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
    ...sentryPlugins,
  ]),
  resolve: {
    alias: {
      "@": resolve(import.meta.dirname, "./src"),
    },
  },
  optimizeDeps: {
    // maplibre-gl v6 loads a worker via a sibling module URL, which the dep
    // prebundler doesn't rewrite — serve it unbundled so the worker resolves.
    exclude: ["maplibre-gl"],
  },
  build: {
    target: "es2022",
    sourcemap: true,
  },
});
