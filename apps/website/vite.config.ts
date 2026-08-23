import {resolve} from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import {tanstackStart} from "@tanstack/react-start/plugin/vite";
import {defineConfig} from "vite";

export default defineConfig({
  plugins: [
    tanstackStart({
      spa: {enabled: true},
      router: {
        quoteStyle: "double",
        routeFileIgnorePattern: "(^|/)__tests__/|\\.test\\.(ts|tsx)$",
      },
    }),
    react({compiler: true}),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": resolve(import.meta.dirname, "./src"),
    },
  },
  build: {
    target: "es2022",
  },
});
