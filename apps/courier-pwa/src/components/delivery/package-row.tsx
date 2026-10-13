import {Box} from "lucide-react";
import type {ManifestPackage} from "@/types/delivery-types";
import {m} from "@/paraglide/messages";
import {cn} from "cnfast";

/** One manifest row: teal cube, code + status pill, description + weight. */
export function PackageRow({pkg}: {pkg: ManifestPackage}) {
  return (
    <li className="flex items-center gap-3 border-b border-grey-100 py-3.5 last:border-0">
      <span className="grid size-9 shrink-0 place-items-center rounded-[8px] bg-primary-50">
        <Box className="size-4.5 text-primary-500" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold">{pkg.code}</p>
        <p className="mt-0.5 text-[12px] text-foreground">{pkg.name}</p>
        <p className="text-[11px] text-grey-500">{pkg.weight}</p>
      </div>
      <span
        className={cn(
          "flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium",
          pkg.scanned ? "border-green-600 text-green-700" : "border-grey-300 text-grey-500"
        )}
      >
        <span className={cn("size-1.5 rounded-full", pkg.scanned ? "bg-green-600" : "bg-grey-400")} aria-hidden="true" />
        {pkg.scanned ? m["job.added"]() : m["job.pending_pkg"]()}
      </span>
    </li>
  );
}
