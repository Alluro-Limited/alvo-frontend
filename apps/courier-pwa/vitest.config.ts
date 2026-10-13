import {resolve} from "node:path";
import {defineConfig} from "vite-plus";
import {createParaglidePlugin} from "./paraglide.config.ts";

export default defineConfig({
  plugins: [createParaglidePlugin()],
  test: {
    globals: true,
    environment: "happy-dom",
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "json-summary", "html", "lcov"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/routeTree.gen.ts",
        "src/paraglide/**",
        // Route files only wire a path to a page component; the pages are tested.
        "src/routes/**",
        "src/test/**",
        "**/*.d.ts",
        "**/*.{test,spec}.{ts,tsx}",
        "**/__tests__/**",
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(import.meta.dirname, "./src"),
    },
  },
});
