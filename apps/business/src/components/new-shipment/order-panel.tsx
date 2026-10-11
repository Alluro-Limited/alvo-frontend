import {m} from "@/paraglide/messages";
import {formatNaira} from "@/lib/format-naira";
import {priceForShipment} from "@/lib/shipment-pricing";
import type {Locker} from "@/types/shipment-types";
import type {RecipientDraft} from "./recipient-draft";
import {lockerName} from "./recipient-draft";

const SIZE_LABEL: Record<RecipientDraft["size"], () => string> = {
  S: m["batch.size_s"],
  M: m["batch.size_m"],
  B: m["batch.size_b"],
};

function OrderRow({recipient, lockers, onRemove}: {recipient: RecipientDraft; lockers: Locker[]; onRemove: () => void}) {
  const size = SIZE_LABEL[recipient.size]();
  const priority = recipient.priority === "express" ? m["shipments.priority_express"]() : m["shipments.priority_standard"]();
  return (
    <div className="flex w-full flex-col gap-2 border-b-[0.5px] border-grey-300 py-3">
      <div className="flex w-full items-center justify-between gap-2">
        <p className="min-w-0 flex-1 truncate text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">
          {recipient.name.trim() || m["batch.unnamed_recipient"]()}
        </p>
        <p className="text-sm leading-[1.4] font-bold tracking-[0.14px] whitespace-nowrap text-black">
          ₦{formatNaira(priceForShipment(recipient.size, recipient.priority))}
        </p>
      </div>
      <p className="w-full text-xs leading-[1.4] font-medium tracking-[0.12px] text-grey-600">
        {`${size} • ${priority} • ${lockerName(lockers, recipient.lockerId)}`}
      </p>
      <button
        type="button"
        onClick={onRemove}
        className="self-start text-sm leading-[1.4] font-medium tracking-[0.14px] text-status-fail hover:underline"
      >
        {m["batch.order_delete"]()}
      </button>
    </div>
  );
}

interface OrderPanelProps {
  recipients: RecipientDraft[];
  lockers: Locker[];
  total: number;
  canPay: boolean;
  onRemove: (id: string) => void;
  onPay: () => void;
}

/** The card's right column: per-recipient order rows and the Pay button pinned to the bottom. */
export function OrderPanel({recipients, lockers, total, canPay, onRemove, onPay}: OrderPanelProps) {
  return (
    <div className="flex min-w-0 flex-1 flex-col justify-between p-6">
      <div className="flex w-full flex-col gap-2">
        <p className="w-full text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{m["batch.order_title"]()}</p>
        {recipients.length === 0 ? (
          <p className="py-3 text-xs leading-[1.4] tracking-[0.12px] text-grey-500">{m["batch.order_empty"]()}</p>
        ) : (
          recipients.map((recipient) => (
            <OrderRow key={recipient.id} recipient={recipient} lockers={lockers} onRemove={() => onRemove(recipient.id)} />
          ))
        )}
      </div>
      <div className="flex w-full flex-col gap-6 border-t-[0.5px] border-[#d0d5dd] pt-3">
        <button
          type="button"
          onClick={onPay}
          disabled={!canPay}
          className="flex h-[38px] w-full items-center justify-center rounded-lg bg-primary-500 px-3 text-base leading-[1.4] font-medium tracking-[0.32px] text-white enabled:cursor-pointer enabled:hover:bg-primary-600 disabled:opacity-50"
        >
          {m["batch.order_pay"]({amount: formatNaira(total)})}
        </button>
      </div>
    </div>
  );
}
