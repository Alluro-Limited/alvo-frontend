import {Pencil} from "lucide-react";
import {cn} from "cnfast";
import type {DeliverySpeed, LockerNode, PackageSize, RecipientDetails, SendQuote} from "@/types/send-types";
import type {SimpleMessage} from "@/lib/i18n";
import type {SendStep} from "./use-send-flow";
import {naira} from "@/lib/money";
import {m} from "@/paraglide/messages";

export const SPEED_LABELS: Record<DeliverySpeed, SimpleMessage> = {
  standard: "send.speed_standard",
  express: "send.speed_express",
  same_day: "send.speed_same_day",
};

const SIZE_LABELS: Record<PackageSize, SimpleMessage> = {
  small: "send.size_small",
  medium: "send.size_medium",
  large: "send.size_large",
};

interface ReviewSectionsProps {
  size: PackageSize | null;
  contents: string;
  origin: LockerNode | null;
  destination: LockerNode | null;
  speed: DeliverySpeed;
  recipient: RecipientDetails;
  quote: SendQuote | null;
  onEdit: (step: SendStep) => void;
}

/** The three stacked detail cards (Package / Route / Recipient) with per-section Edit links. */
export function ReviewSections({size, contents, origin, destination, speed, recipient, quote, onEdit}: ReviewSectionsProps) {
  return (
    <div className="flex w-full flex-col overflow-clip rounded-[12px]">
      <Section title={m["send.pkg_details"]()} onEdit={() => onEdit("package")} bordered>
        <Row label={m["send.pkg_size"]()} value={size ? m[SIZE_LABELS[size]]() : ""} />
        <Row label={m["send.contents_row"]()} value={contents || "—"} />
        <Row label={m["send.item_value"]()} value={naira(0)} />
      </Section>
      <Section title={m["send.route"]()} onEdit={() => onEdit("nodes")} bordered>
        <Row label={m["send.from"]()} value={origin?.name ?? ""} />
        <Row label={m["send.speed_row"]()} value={m[SPEED_LABELS[speed]]()} />
        <Row label={m["send.to"]()} value={destination?.name ?? ""} />
        <Row label={m["send.eta"]()} value={quote?.arrival ?? ""} />
      </Section>
      <Section title={m["send.rc_info"]()} onEdit={() => onEdit("recipient")}>
        <Row label={m["send.rc_name_row"]()} value={recipient.name} />
        <Row label={m["send.rc_phone_row"]()} value={`+234 ${recipient.phone}`} />
        {recipient.note ? <Row label={m["send.rc_note_row"]()} value={recipient.note} /> : null}
      </Section>
    </div>
  );
}

function Section({title, bordered, onEdit, children}: {title: string; bordered?: boolean; onEdit: () => void; children: React.ReactNode}) {
  return (
    <div className={cn("flex w-full flex-col gap-4 py-3", bordered && "border-b border-grey-300")}>
      <div className="flex w-full items-center gap-2.5">
        <p className="flex-1 text-[16px] font-medium leading-[1.4] tracking-[0.16px] text-foreground">{title}</p>
        <button type="button" onClick={onEdit} className="flex flex-1 items-center justify-end gap-1">
          <span className="text-[14px] leading-[1.4] tracking-[0.14px] text-primary-500">{m["send.edit"]()}</span>
          <Pencil className="size-3.5 text-primary-500" aria-hidden="true" />
        </button>
      </div>
      <div className="flex w-full flex-col gap-3">{children}</div>
    </div>
  );
}

function Row({label, value}: {label: string; value: string}) {
  return (
    <div className="flex w-full flex-col gap-0.5">
      <span className="text-[12px] leading-[1.4] tracking-[0.12px] text-grey-500">{label}</span>
      <span className="text-[14px] font-medium leading-[1.4] tracking-[0.14px] text-foreground">{value}</span>
    </div>
  );
}
