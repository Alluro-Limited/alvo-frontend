import {Truck} from "lucide-react";
import {m} from "@/paraglide/messages";

interface JobEmptyProps {
  offline: boolean;
  kind: "regular" | "speed";
}

/** The section's empty state: grey OFF LINE badge + offline copy, or the truck-off icon + empty copy. */
export function JobEmpty({offline, kind}: JobEmptyProps) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-8 text-center">
      {offline ? (
        <>
          <span className="rounded-[4px] bg-grey-200 px-1.5 py-0.5 text-[9px] font-bold tracking-[0.08em] text-grey-500">
            {m["home.offline_badge"]()}
          </span>
          <p className="text-[15px] font-semibold text-foreground">{m["home.offline_title"]()}</p>
          <p className="max-w-[260px] text-[13px] leading-[19px] text-grey-500">{m["home.offline_desc"]()}</p>
        </>
      ) : (
        <>
          <span className="flex size-12 items-center justify-center rounded-full bg-grey-100">
            <Truck className="size-6 text-grey-400" aria-hidden="true" />
          </span>
          <p className="text-[15px] font-semibold text-foreground">
            {kind === "regular" ? m["home.empty_regular"]() : m["home.empty_speed"]()}
          </p>
        </>
      )}
    </div>
  );
}
