import {X} from "lucide-react";
import {AuthSheet} from "@/components/auth/auth-sheet";
import type {StorageInfo} from "@/types/activity-types";
import {m} from "@/paraglide/messages";

interface StorageSheetProps {
  open: boolean;
  storage: StorageInfo;
  onClose: () => void;
}

/** "Storage Details" sheet — node, location, locker size, duration, and the stored item. */
export function StorageSheet({open, storage, onClose}: StorageSheetProps) {
  return (
    <AuthSheet open={open} onClose={onClose}>
      <div className="mt-2 flex w-full flex-col pb-4">
        <div className="flex w-full items-center justify-between">
          <h2 className="text-[20px] font-medium leading-[1.2] text-foreground">{m["del.storage_title"]()}</h2>
          <button type="button" onClick={onClose} aria-label={m["loc.close"]()} className="flex size-8 items-center justify-center">
            <X className="size-[18px]" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-6 flex w-full flex-col gap-5">
          <Row label={m["del.node"]()} value={storage.node} />
          <div className="flex w-full flex-col gap-1.5">
            <span className="text-[14px] leading-[1.4] tracking-[0.14px] text-grey-500">{m["del.location"]()}</span>
            <span className="text-[14px] font-medium leading-[1.4] tracking-[0.14px] text-foreground">{storage.location}</span>
            <span className="text-[14px] leading-[1.4] tracking-[0.14px] text-foreground">{storage.address}</span>
          </div>
          <span aria-hidden="true" className="h-px w-full bg-grey-300" />
          <Row label={m["del.locker_size"]()} value={storage.lockerSize} />
          <Row label={m["del.duration"]()} value={storage.duration} />
          <Row label={m["del.item"]()} value={storage.item} />
        </div>
      </div>
    </AuthSheet>
  );
}

function Row({label, value}: {label: string; value: string}) {
  return (
    <div className="flex w-full flex-col gap-1.5">
      <span className="text-[14px] leading-[1.4] tracking-[0.14px] text-grey-500">{label}</span>
      <span className="text-[14px] font-medium leading-[1.4] tracking-[0.14px] text-foreground">{value}</span>
    </div>
  );
}
