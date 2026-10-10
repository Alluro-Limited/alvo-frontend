import {SquarePen} from "lucide-react";
import {formatJoinedLong, formatNaira} from "@/lib/format";
import {m} from "@/paraglide/messages";
import type {SmeDetail} from "@/types/smes-types";
import {SmeDrawerCard} from "./sme-drawer-card";

function DetailRow({label, value}: {label: string; value: string}) {
  return (
    <div className="flex items-start justify-between gap-6 border-b border-grey-200 py-3 last:border-b-0">
      <span className="shrink-0 text-sm leading-[1.4] tracking-[0.14px] text-grey-500">{label}</span>
      <span className="text-right text-sm leading-[1.4] font-medium tracking-[0.14px] text-grey-800">{value}</span>
    </div>
  );
}

function SubSection({title, children}: {title: string; children: React.ReactNode}) {
  return (
    <div>
      <p className="pt-4 pb-1 text-sm font-bold tracking-[0.14px] text-black">{title}</p>
      <div>{children}</div>
    </div>
  );
}

interface SmeOverviewTabProps {
  detail: SmeDetail;
  onEdit: () => void;
}

/** Overview tab — one card holding the Business Info / Contact Info / Billing & Credits sections. */
export function SmeOverviewTab({detail, onEdit}: SmeOverviewTabProps) {
  return (
    <SmeDrawerCard
      title={m["smes.business_info"]()}
      action={
        <button
          type="button"
          onClick={onEdit}
          className="flex items-center gap-1 text-sm font-medium text-primary-500 hover:text-primary-600"
        >
          {m["smes.card_edit"]()}
          <SquarePen className="size-4" aria-hidden="true" />
        </button>
      }
    >
      <div>
        <DetailRow label={m["smes.info_name"]()} value={detail.businessName} />
        <DetailRow label={m["smes.info_business_type"]()} value={detail.businessType} />
        <DetailRow label={m["smes.info_business_phone"]()} value={detail.businessPhone} />
        <DetailRow label={m["smes.info_business_email"]()} value={detail.businessEmail} />
        <DetailRow label={m["smes.info_location"]()} value={detail.location} />
        <DetailRow label={m["smes.info_joined"]()} value={formatJoinedLong(detail.joinedAt)} />
        <SubSection title={m["smes.contact_info"]()}>
          <DetailRow label={m["smes.info_name"]()} value={detail.contactName} />
          <DetailRow label={m["smes.info_email"]()} value={detail.contactEmail} />
          <DetailRow label={m["smes.info_phone"]()} value={detail.contactPhone} />
        </SubSection>
        <SubSection title={m["smes.billing_title"]()}>
          <DetailRow label={m["smes.billing_wallet"]()} value={formatNaira(detail.walletBalanceKobo)} />
          <DetailRow label={m["smes.billing_dva"]()} value={detail.dvaAccount} />
          <DetailRow label={m["smes.billing_bank"]()} value={detail.bank} />
        </SubSection>
      </div>
    </SmeDrawerCard>
  );
}
