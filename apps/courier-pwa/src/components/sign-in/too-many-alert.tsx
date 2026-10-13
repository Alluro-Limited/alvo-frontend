import {m} from "@/paraglide/messages";

/** The "Too Many Attempts" banner the API triggers with a 429 after repeated wrong codes. */
export function TooManyAlert() {
  return (
    <div role="alert" className="mt-auto rounded-[10px] bg-danger-50 px-4 py-4">
      <p className="text-[15px] leading-[22px] font-semibold text-foreground">{m["auth.too_many"]()}</p>
      <p className="mt-1 text-[13px] leading-[18px] text-grey-700">{m["auth.too_many_desc"]()}</p>
    </div>
  );
}
