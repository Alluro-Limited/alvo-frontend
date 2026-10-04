import {paraglideVitePlugin} from "@inlang/paraglide-js";
import type {PluginOption} from "vite-plus";

export function createParaglidePlugin(): PluginOption {
  return paraglideVitePlugin({
    project: "./project.inlang",
    outdir: "./src/paraglide",
    emitTsDeclarations: true,
    // Keep locale routing out of URLs while caching the resolved locale in memory.
    strategy: ["globalVariable", "localStorage", "cookie", "preferredLanguage", "baseLocale"],
  });
}
