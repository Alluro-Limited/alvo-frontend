import {Truck} from "lucide-react";
import {m} from "@/paraglide/messages";

/** Empty marketplace: dashed truck icon on a grey circle + "No available jobs at the moment". */
export function JobsEmpty() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-24">
      <span className="grid size-14 place-items-center rounded-full bg-grey-100">
        <Truck className="size-6 text-grey-400" strokeWidth={1.75} aria-hidden="true" />
      </span>
      <p className="mt-4 text-[14px] font-medium text-grey-500">{m["jobs.none"]()}</p>
    </div>
  );
}
