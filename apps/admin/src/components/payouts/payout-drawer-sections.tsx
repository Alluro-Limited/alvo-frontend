import {StatusTag} from "@alvo/ui";
import {m} from "@/paraglide/messages";
import type {PayoutDetail, PayoutDispute} from "@/types/payouts-types";
import {formatJoinedLong, formatNairaAmount} from "@/lib/format";
import {DISPUTE_STATUS_LABELS, DISPUTE_STATUS_TAGS} from "./payout-labels";

const DETAIL_ROW = "flex items-center justify-between gap-4 border-b border-grey-200 py-3.5 last:border-0";
const DETAIL_LABEL = "text-sm leading-[1.4] tracking-[0.14px] text-grey-600";
const DETAIL_VALUE = "text-sm leading-[1.4] font-medium tracking-[0.14px] text-black";

/** The three drawer body sections — Earnings Breakdown, Bank Details, Payment Disputes. */
export function PayoutDrawerSections({detail}: {detail: PayoutDetail}) {
  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
      <SectionCard title={m["payout.earnings_title"]()}>
        <div className={DETAIL_ROW}>
          <p className={DETAIL_LABEL}>{m["payout.earnings_deliveries"]()}</p>
          <p className={DETAIL_VALUE}>{detail.deliveriesCompleted}</p>
        </div>
        <div className={DETAIL_ROW}>
          <p className={DETAIL_LABEL}>{m["payout.earnings_gross"]()}</p>
          <p className={DETAIL_VALUE}>{`₦${formatNairaAmount(detail.grossEarnings)}`}</p>
        </div>
        <div className={DETAIL_ROW}>
          <p className={DETAIL_LABEL}>{m["payout.earnings_net"]()}</p>
          <p className="text-sm leading-[1.4] font-bold tracking-[0.14px] text-primary-800">{`₦${formatNairaAmount(detail.netPayout)}`}</p>
        </div>
      </SectionCard>
      <SectionCard title={m["payout.bank_title"]()}>
        <div className={DETAIL_ROW}>
          <p className={DETAIL_LABEL}>{m["payout.bank_name"]()}</p>
          <p className={DETAIL_VALUE}>{detail.bank.bankName}</p>
        </div>
        <div className={DETAIL_ROW}>
          <p className={DETAIL_LABEL}>{m["payout.bank_account"]()}</p>
          <p className={DETAIL_VALUE}>{detail.bank.accountNumber}</p>
        </div>
        <div className={DETAIL_ROW}>
          <p className={DETAIL_LABEL}>{m["payout.bank_holder"]()}</p>
          <p className={DETAIL_VALUE}>{detail.bank.accountHolder}</p>
        </div>
      </SectionCard>
      {detail.disputes.length > 0 && (
        <SectionCard title={m["payout.disputes_title"]()}>
          {detail.disputes.map((dispute) => (
            <DisputeRow key={dispute.id} dispute={dispute} />
          ))}
        </SectionCard>
      )}
    </div>
  );
}

function SectionCard({title, children}: {title: string; children: React.ReactNode}) {
  return (
    <section className="rounded-xl border border-grey-300 bg-white px-4 py-2">
      <p className="border-b border-grey-200 py-3.5 text-sm leading-[1.4] font-bold tracking-[0.14px] text-primary-800">{title}</p>
      {children}
    </section>
  );
}

function DisputeRow({dispute}: {dispute: PayoutDispute}) {
  return (
    <div className="flex flex-col gap-1.5 border-b border-grey-200 py-3.5 last:border-0">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{dispute.parcelId}</p>
        <StatusTag status={DISPUTE_STATUS_TAGS[dispute.status]}>{DISPUTE_STATUS_LABELS[dispute.status]()}</StatusTag>
      </div>
      <p className="text-xs leading-[1.4] font-medium tracking-[0.12px] text-grey-600">{dispute.title}</p>
      <p className="text-xs leading-[1.4] tracking-[0.12px] text-grey-500">{dispute.description}</p>
      <p className="text-xs leading-[1.4] tracking-[0.12px] text-grey-400">{formatJoinedLong(dispute.date)}</p>
    </div>
  );
}
