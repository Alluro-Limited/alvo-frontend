import {Pencil} from "lucide-react";
import type {SafeDuration, SafeNode, SafeSizeOption} from "@/types/safe-types";
import {m} from "@/paraglide/messages";

interface SafeSummaryProps {
  node: SafeNode;
  size: SafeSizeOption | undefined;
  duration: SafeDuration | undefined;
  storing: string;
  onEdit: () => void;
}

/** "Storage Summary" — the review card of location/size/duration/contents, with an Edit link back to step 2. */
export function SafeSummary({node, size, duration, storing, onEdit}: SafeSummaryProps) {
  return (
    <div className="flex w-full flex-col gap-5 rounded-[12px] bg-[#f9f9f9] p-5">
      <div className="flex w-full items-center justify-between">
        <p className="text-[16px] font-medium leading-[1.4] tracking-[0.16px] text-foreground">{m["safe.summary"]()}</p>
        <button
          type="button"
          onClick={onEdit}
          className="flex items-center gap-1 text-[14px] leading-[1.4] tracking-[0.14px] text-primary-500"
        >
          {m["safe.edit"]()}
          <Pencil className="size-3.5" aria-hidden="true" />
        </button>
      </div>
      <div className="flex w-full flex-col gap-4 text-[14px] leading-[1.4] tracking-[0.14px]">
        <SummaryRow label={m["safe.loc_row"]()} value={`${node.name}, ${node.floor}, Near Entrance 2`} />
        <SummaryRow label={m["safe.size_row"]()} value={size ? `${size.label} ${size.dims}` : "—"} />
        <SummaryRow label={m["safe.dur_row"]()} value={duration ? `${duration.label.toLowerCase()} (${duration.until})` : "—"} />
        <SummaryRow label={m["safe.storing_row"]()} value={storing.trim() || "—"} />
      </div>
    </div>
  );
}

function SummaryRow({label, value}: {label: string; value: string}) {
  return (
    <div className="flex w-full flex-col gap-0.5">
      <span className="text-grey-500">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
