import {useState} from "react";
import {ChevronDown, X} from "lucide-react";
import {cn} from "cnfast";
import {Button} from "@alvo/ui";
import {AuthSheet} from "@/components/auth/auth-sheet";
import {useExtendDropoff, useExtendPreview} from "@/queries/use-activity-queries";
import type {ExtendPreview, ExtendResult} from "@/types/activity-types";
import {naira} from "@/lib/money";
import {m} from "@/paraglide/messages";
import iconCheckUrl from "@/assets/icon-check.svg";

const HOURS = [1, 3, 6, 12, 24];

interface ExtendSheetProps {
  open: boolean;
  deliveryId: string;
  remaining: number;
  onClose: () => void;
}

/** "Extend Drop-Off Time" sheet — duration select → schedule preview → confirm → reactivated success. */
export function ExtendSheet({open, deliveryId, remaining, onClose}: ExtendSheetProps) {
  const [hours, setHours] = useState<number | null>(null);
  const [result, setResult] = useState<ExtendResult | null>(null);
  const preview = useExtendPreview(deliveryId, hours);
  const extend = useExtendDropoff(deliveryId);

  const close = () => {
    setHours(null);
    setResult(null);
    onClose();
  };

  return (
    <AuthSheet open={open} onClose={close}>
      {extend.isPending ? (
        <LoadingDots />
      ) : result ? (
        <ExtendSuccess result={result} onDone={close} />
      ) : (
        <ExtendForm
          hours={hours}
          onHours={setHours}
          remaining={remaining}
          preview={preview.data ?? null}
          onConfirm={() => hours !== null && extend.mutate(hours, {onSuccess: setResult})}
          onClose={close}
        />
      )}
    </AuthSheet>
  );
}

function LoadingDots() {
  return (
    <div className="flex h-64 w-full items-center justify-center gap-2" aria-busy="true" role="status">
      {[0, 1, 2].map((i) => (
        <span key={i} className="size-2.5 animate-pulse rounded-full bg-grey-400" />
      ))}
    </div>
  );
}

interface ExtendFormProps {
  hours: number | null;
  onHours: (h: number) => void;
  remaining: number;
  preview: ExtendPreview | null;
  onConfirm: () => void;
  onClose: () => void;
}

function ExtendForm({hours, onHours, remaining, preview, onConfirm, onClose}: ExtendFormProps) {
  return (
    <div className="mt-2 flex w-full flex-col pb-4">
      <div className="flex w-full items-center justify-between">
        <h2 className="text-[20px] font-medium leading-[1.2] text-foreground">{m["acc.sheet_title"]()}</h2>
        <button type="button" onClick={onClose} aria-label={m["loc.close"]()} className="flex size-8 items-center justify-center">
          <X className="size-[18px]" aria-hidden="true" />
        </button>
      </div>
      <div className="mt-6 flex w-full flex-col gap-4">
        <DurationSelect value={hours} onChange={onHours} />
        <p className="text-[12px] leading-[1.4] tracking-[0.12px] text-status-fail">{m["acc.ext_left"]({count: remaining})}</p>
        {preview ? <ScheduleCard addedTime={preview.addedTime} newDeadline={preview.newDeadline} fee={preview.fee} /> : null}
        <Button className="w-full text-[16px] font-medium" disabled={hours === null} onClick={onConfirm}>
          {preview ? m["acc.confirm"]() : m["acc.extend"]()}
        </Button>
      </div>
    </div>
  );
}

function DurationSelect({value, onChange}: {value: number | null; onChange: (h: number) => void}) {
  return (
    <div className="flex w-full flex-col gap-2">
      <label htmlFor="extend-duration" className="text-[16px] leading-[1.4] tracking-[0.16px] text-primary-800">
        {m["safe.duration"]()}
      </label>
      <div className="relative flex w-full items-center overflow-clip rounded-[8px] border-[0.75px] border-grey-300 focus-within:border-primary-500">
        <select
          id="extend-duration"
          value={value ?? ""}
          onChange={(e) => onChange(Number(e.target.value))}
          className={cn(
            "w-full appearance-none bg-transparent px-4 py-3.5 text-[14px] leading-[1.4] tracking-[0.14px] focus:outline-none",
            value !== null ? "text-foreground" : "text-grey-500"
          )}
        >
          <option value="" disabled>
            {m["safe.duration_ph"]()}
          </option>
          {HOURS.map((h) => (
            <option key={h} value={h}>
              {h === 1 ? m["acc.hour"]({count: h}) : m["acc.hours"]({count: h})}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 size-5 text-grey-500" aria-hidden="true" />
      </div>
    </div>
  );
}

function ScheduleCard({addedTime, newDeadline, fee}: {addedTime: string; newDeadline: string; fee: number}) {
  return (
    <div className="flex w-full flex-col gap-1 rounded-[12px] bg-[#f9f9f9] p-4">
      <span className="text-[16px] font-medium leading-[1.4] tracking-[0.16px] text-foreground">{m["acc.schedule_title"]()}</span>
      <CardRow label={m["acc.added"]()} value={addedTime} />
      <CardRow label={m["acc.new_deadline"]()} value={newDeadline} />
      {fee > 0 ? <CardRow label={m["acc.fee_attached"]()} value={naira(fee)} /> : null}
    </div>
  );
}

function CardRow({label, value}: {label: string; value: string}) {
  return (
    <span className="flex items-center gap-1 text-[14px] leading-[1.4] tracking-[0.14px]">
      <span className="text-grey-500">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </span>
  );
}

function ExtendSuccess({result, onDone}: {result: ExtendResult; onDone: () => void}) {
  return (
    <div className="mt-4 flex w-full flex-col items-center pb-4">
      <img src={iconCheckUrl} alt="" aria-hidden="true" className="size-14" />
      <h2 className="mt-4 max-w-[260px] text-center text-[18px] font-medium leading-[1.3] text-foreground">{m["acc.success_title"]()}</h2>
      <div className="mt-4 flex w-full flex-col gap-1 rounded-[12px] bg-[#f9f9f9] p-4">
        <span className="text-[16px] leading-[1.4] tracking-[0.16px]">
          <span className="text-grey-500">{m["acc.new_deadline"]()}</span>{" "}
          <span className="font-bold text-foreground">{result.newDeadline}</span>
        </span>
        <CardRow label={m["acc.node"]()} value={result.lockerNode} />
        <CardRow label={m["acc.status"]()} value={result.status} />
      </div>
      <p className="mt-3 text-center text-[12px] leading-[1.4] tracking-[0.12px] text-grey-500">{m["acc.success_note"]()}</p>
      <Button className="mt-4 w-full text-[16px] font-medium" onClick={onDone}>
        {m["acc.done"]()}
      </Button>
    </div>
  );
}
