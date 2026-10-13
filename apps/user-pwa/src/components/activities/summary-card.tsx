import {Copy} from "lucide-react";
import type {DeliveryDetail} from "@/types/activity-types";
import {naira} from "@/lib/money";
import {m} from "@/paraglide/messages";

function copyRef(refId: string) {
  void navigator.clipboard?.writeText(refId).catch(() => undefined);
}

/** The grey summary card — Package ID + copy, Amount Paid, Payment method, Date & time. */
export function SummaryCard({delivery}: {delivery: DeliveryDetail}) {
  const idLabel = delivery.kind === "safe" ? m["act.safe_id"]() : m["del.pkg_id"]();
  return (
    <div className="flex w-full flex-col gap-4 rounded-[12px] bg-[#f9f9f9] px-4 py-5">
      <Row label={idLabel}>
        <span className="flex items-center gap-1 text-[14px] font-medium leading-[1.4] tracking-[0.14px] text-[#00443c]">
          {delivery.refId}
          <button
            type="button"
            onClick={() => copyRef(delivery.refId)}
            aria-label={m["send.copy"]()}
            className="flex size-4 items-center justify-center"
          >
            <Copy className="size-3" aria-hidden="true" />
          </button>
        </span>
      </Row>
      <Row label={m["del.amount"]()}>
        <span className="text-[14px] font-medium leading-[1.4] tracking-[0.14px] text-[#00443c]">{naira(delivery.amountPaid)}</span>
      </Row>
      <Row label={m["del.method"]()}>
        <span className="text-[14px] leading-[1.4] tracking-[0.14px] text-[#00443c]">{delivery.paymentMethod}</span>
      </Row>
      <Row label={m["del.date"]()}>
        <span className="text-[14px] font-medium leading-[1.4] tracking-[0.14px] text-[#00443c]">{delivery.paidAt}</span>
      </Row>
    </div>
  );
}

function Row({label, children}: {label: string; children: React.ReactNode}) {
  return (
    <div className="flex w-full items-center justify-between">
      <span className="text-[12px] leading-[1.4] tracking-[0.12px] text-grey-400">{label}</span>
      {children}
    </div>
  );
}
