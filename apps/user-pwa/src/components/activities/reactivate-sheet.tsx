import {useState} from "react";
import {ChevronDown, Info, X} from "lucide-react";
import {cn} from "cnfast";
import {Button} from "@alvo/ui";
import {AuthSheet} from "@/components/auth/auth-sheet";
import {GatewaySheet} from "@/components/safe/gateway-sheet";
import {PaymentPicker} from "@/components/send/payment-picker";
import {usePickupPreview, useReactivatePickup} from "@/queries/use-activity-queries";
import type {ExtendPreview} from "@/types/activity-types";
import type {PaymentChannel} from "@/types/send-types";
import {naira} from "@/lib/money";
import {m} from "@/paraglide/messages";

const HOURS = [1, 3, 6, 12, 24];

interface ReactivateSheetProps {
  open: boolean;
  deliveryId: string;
  /** ₦ fee per reactivation, from the delivery detail. */
  fee: number;
  onClose: () => void;
}

/** The paid "Extend Drop-Off Time" sheet for an expired pickup code — fee note, duration, payment, reactivate. */
export function ReactivateSheet({open, deliveryId, fee, onClose}: ReactivateSheetProps) {
  const [hours, setHours] = useState<number | null>(null);
  const [channel, setChannel] = useState<PaymentChannel>("online");
  const [gatewayOpen, setGatewayOpen] = useState(false);
  const preview = usePickupPreview(deliveryId, hours);
  const reactivate = useReactivatePickup(deliveryId);

  const close = () => {
    setHours(null);
    setChannel("online");
    setGatewayOpen(false);
    onClose();
  };

  const pay = () => {
    if (hours === null) return;
    if (channel === "online") setGatewayOpen(true);
    reactivate.mutate({hours, channel}, {onSuccess: close});
  };

  return (
    <>
      <AuthSheet open={open} onClose={close}>
        {reactivate.isPending && channel === "wallet" ? (
          <div className="flex h-64 w-full items-center justify-center gap-2" aria-busy="true" role="status">
            {[0, 1, 2].map((i) => (
              <span key={i} className="size-2.5 animate-pulse rounded-full bg-grey-400" />
            ))}
          </div>
        ) : (
          <ReactivateForm
            hours={hours}
            onHours={setHours}
            fee={fee}
            preview={preview.data ?? null}
            channel={channel}
            onChannel={setChannel}
            onPay={pay}
            onClose={close}
          />
        )}
      </AuthSheet>
      <GatewaySheet open={gatewayOpen} onClose={() => setGatewayOpen(false)} />
    </>
  );
}

interface ReactivateFormProps {
  hours: number | null;
  onHours: (h: number) => void;
  fee: number;
  preview: ExtendPreview | null;
  channel: PaymentChannel;
  onChannel: (c: PaymentChannel) => void;
  onPay: () => void;
  onClose: () => void;
}

function ReactivateForm({hours, onHours, fee, preview, channel, onChannel, onPay, onClose}: ReactivateFormProps) {
  return (
    <div className="mt-2 flex w-full flex-col pb-4">
      <div className="flex w-full items-center justify-between">
        <h2 className="text-[20px] font-medium leading-[1.2] text-foreground">{m["acc.sheet_title"]()}</h2>
        <button type="button" onClick={onClose} aria-label={m["loc.close"]()} className="flex size-8 items-center justify-center">
          <X className="size-[18px]" aria-hidden="true" />
        </button>
      </div>
      <div className="mt-5 flex w-full flex-col gap-4">
        <FeeNote />
        <DurationSelect value={hours} fee={fee} onChange={onHours} />
        {preview ? <ScheduleCard preview={preview} /> : null}
        <PaymentPicker channel={channel} walletBalance={fee} onChange={onChannel} />
        <Button className="w-full text-[16px] font-medium" disabled={hours === null} onClick={onPay}>
          {m["acc.pay_reactivate"]({amount: naira(fee)})}
        </Button>
      </div>
    </div>
  );
}

function FeeNote() {
  return (
    <div className="flex w-full items-start gap-3 rounded-[12px] border border-primary-200 bg-primary-50 p-4">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-[8px] bg-primary-500 text-white">
        <Info className="size-5" aria-hidden="true" />
      </span>
      <span className="flex flex-col gap-1">
        <span className="text-[14px] font-medium leading-[1.4] tracking-[0.14px] text-foreground">{m["acc.fee_title"]()}</span>
        <span className="text-[14px] leading-[1.4] tracking-[0.14px] text-grey-600">{m["acc.fee_note"]()}</span>
      </span>
    </div>
  );
}

function DurationSelect({value, fee, onChange}: {value: number | null; fee: number; onChange: (h: number) => void}) {
  return (
    <div className="flex w-full flex-col gap-2">
      <label htmlFor="reactivate-duration" className="text-[16px] leading-[1.4] tracking-[0.16px] text-primary-800">
        {m["safe.duration"]()}
      </label>
      <div className="relative flex w-full items-center overflow-clip rounded-[8px] border-[0.75px] border-grey-300 focus-within:border-primary-500">
        <select
          id="reactivate-duration"
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
            <option key={h} value={h}>{`+${h === 1 ? m["acc.hour"]({count: h}) : m["acc.hours"]({count: h})} - ${naira(fee)}`}</option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 size-5 text-grey-500" aria-hidden="true" />
      </div>
    </div>
  );
}

function ScheduleCard({preview}: {preview: ExtendPreview}) {
  return (
    <div className="flex w-full flex-col gap-1 rounded-[12px] bg-[#f9f9f9] p-4">
      <span className="text-[16px] font-medium leading-[1.4] tracking-[0.16px] text-foreground">{m["acc.schedule_title"]()}</span>
      <CardRow label={m["acc.new_deadline"]()} value={preview.newDeadline} />
      <CardRow label={m["acc.ext_fee"]()} value={naira(preview.fee)} />
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
