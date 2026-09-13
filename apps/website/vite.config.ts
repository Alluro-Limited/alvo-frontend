import {resolve} from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import {tanstackStart} from "@tanstack/react-start/plugin/vite";
import mdx from "fumadocs-mdx/vite";
import {defineConfig} from "vite";

const __dirname = import.meta.dirname;

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
    mdx(await import("./source.config.ts")),
    tailwindcss(),
  ],
  resolve: {
    alias: [
      {
        find: "fumadocs-mdx:collections/server",
        replacement: resolve(__dirname, ".source/server.ts"),
      },
      {
        find: "fumadocs-mdx:collections/browser",
        replacement: resolve(__dirname, ".source/browser.ts"),
      },
      {
        find: "fumadocs-mdx:collections/dynamic",
        replacement: resolve(__dirname, ".source/dynamic.ts"),
      },
      {find: "@", replacement: resolve(__dirname, "./src")},
    ],
  },
  build: {
    target: "es2022",
  },
});
