import type {m} from "@/paraglide/messages";

/** Any Paraglide message key. */
type Message = keyof typeof m;

/** A message key for a string with no params — safe to render as `m[key]()` from a stored key. */
export type SimpleMessage = {
  [K in Message]: (typeof m)[K] extends () => string ? K : never;
}[Message];
