import {defineConfig} from "react-doctor/api";

export default defineConfig({
  ignore: {
    files: [
      "**/__tests__/**",
      "apps/**/*.{test,spec}.{js,ts,jsx,tsx}",
      "packages/**/*.{test,spec}.{js,ts,jsx,tsx}",
      "**/*.ct.tsx",
      "apps/**/test/**",
      "packages/**/test/**",
      "playwright/**",
      "vitest.setup.ts",
      "reports/**",
    ],
  },
});
