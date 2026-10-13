import {vi} from "vite-plus/test";

// Paraglide messages return their key in tests, so assertions match stable keys
// instead of English copy. Cached per key so identity checks also hold. Tests that
// need real output opt out with `vi.importActual("@/paraglide/messages")`.
vi.mock("@/paraglide/messages", () => {
  const cache = new Map<string, () => string>();
  return {
    m: new Proxy({} as Record<string, () => string>, {
      get(_target, prop) {
        if (typeof prop !== "string") return undefined;
        if (!cache.has(prop)) cache.set(prop, () => prop);
        return cache.get(prop);
      },
    }),
  };
});
