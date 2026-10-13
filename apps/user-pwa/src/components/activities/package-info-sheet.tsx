import {X} from "lucide-react";
import {AuthSheet} from "@/components/auth/auth-sheet";
import type {DeliveryInfo} from "@/types/activity-types";
import {naira} from "@/lib/money";
import {m} from "@/paraglide/messages";

interface InfoRow {
  label: string;
  value: string;
}

function rows(info: DeliveryInfo): InfoRow[][] {
  return [
    [
      {label: m["del.i_size"](), value: info.size},
      {label: m["del.i_contents"](), value: info.contents},
      {label: m["del.i_value"](), value: naira(info.value)},
    ],
    [
      {label: m["del.i_recipient"](), value: info.recipient},
      {label: m["del.i_phone"](), value: info.phone},
      {label: m["del.i_note"](), value: info.note},
    ],
    [{label: m["del.i_speed"](), value: info.speed}],
  ];
}

/** "Package Information" sheet — package, recipient, and speed fields grouped by dividers. */
export function PackageInfoSheet({open, info, onClose}: {open: boolean; info: DeliveryInfo | null; onClose: () => void}) {
  if (!info) return null;
  return (
    <AuthSheet open={open} onClose={onClose}>
      <div className="mt-2 flex w-full flex-col pb-4">
        <div className="flex w-full items-center justify-between">
          <h2 className="text-[20px] font-medium leading-[1.2] text-foreground">{m["del.info_title"]()}</h2>
          <button type="button" onClick={onClose} aria-label={m["loc.close"]()} className="flex size-8 items-center justify-center">
            <X className="size-[18px]" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-4 flex w-full flex-col gap-5">
          {rows(info).map((group, gi) => (
            <div key={gi} className="flex w-full flex-col gap-4 border-b-[0.5px] border-grey-300 pb-5 last:border-b-0 last:pb-0">
              {group.map((row) => (
                <div key={row.label} className="flex w-full flex-col gap-1">
                  <span className="text-[12px] leading-[1.4] tracking-[0.12px] text-grey-400">{row.label}</span>
                  <span className="text-[14px] font-medium leading-[1.4] tracking-[0.14px] text-foreground">{row.value}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </AuthSheet>
  );
}
