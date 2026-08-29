import {defineConfig} from "vitest/config";
import {resolve} from "node:path";

export default defineConfig({
  test: {
    globals: true,
    environment: "happy-dom",
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "dist/", "src/**/*.d.ts"],
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
