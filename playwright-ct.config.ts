import {defineConfig, devices} from "@playwright/experimental-ct-react";
import {resolve, dirname} from "node:path";
import {fileURLToPath} from "node:url";
import tailwindcss from "@tailwindcss/vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  testDir: "./packages/ui/src",
  testMatch: "**/*.ct.tsx",
  timeout: 10_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    trace: "on-first-retry",
    ctPort: 3100,
    ctViteConfig: {
      plugins: [tailwindcss()],
      resolve: {
        alias: [{find: /^@\//, replacement: resolve(__dirname, "./packages/ui/src") + "/"}],
        dedupe: ["react", "react-dom", "@alvo/ui"],
      },
      optimizeDeps: {
        include: ["react", "react-dom", "@base-ui/react", "cnfast"],
      },
    },
  },
  projects: [{name: "chromium", use: {...devices["Desktop Chrome"]}}],
});
