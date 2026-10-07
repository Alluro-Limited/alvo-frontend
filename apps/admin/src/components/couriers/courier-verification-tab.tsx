import {BadgeCheck, Eye} from "lucide-react";
import {m} from "@/paraglide/messages";
import type {CourierDetail, CourierVerificationItem} from "@/types/couriers-types";
import {VERIFICATION_ITEM_LABELS} from "./courier-labels";
import {CourierPngBadge} from "./courier-png-badge";

interface CourierVerificationTabProps {
  detail: CourierDetail;
  onViewDocument: (item: CourierVerificationItem) => void;
  onApprove: (item: CourierVerificationItem) => void;
}

/** Verification tab: the signup checklist — each item is Approved or offers a Mark Approved action. */
export function CourierVerificationTab({detail, onViewDocument, onApprove}: CourierVerificationTabProps) {
  return (
    <section className="rounded-lg bg-white p-4" aria-label={m["couriers.verification_title"]()}>
      <h3 className="text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{m["couriers.verification_title"]()}</h3>
      <div className="flex flex-col pt-2">
        {detail.verificationItems.map((item) => (
          <VerificationRow key={item.key} item={item} onViewDocument={onViewDocument} onApprove={onApprove} />
        ))}
      </div>
    </section>
  );
}

interface VerificationRowProps {
  item: CourierVerificationItem;
  onViewDocument: (item: CourierVerificationItem) => void;
  onApprove: (item: CourierVerificationItem) => void;
}

function VerificationRow({item, onViewDocument, onApprove}: VerificationRowProps) {
  const approved = item.status === "approved";
  return (
    <div className="border-b border-grey-200 py-3 last:border-b-0">
      <div className="flex items-center justify-between">
        <p className="text-sm leading-[1.4] tracking-[0.14px] text-grey-600">{VERIFICATION_ITEM_LABELS[item.key]()}</p>
        {approved ? (
          <span className="flex items-center gap-1 text-sm leading-[1.4] font-medium text-status-success-dark">
            <BadgeCheck className="size-4" aria-hidden="true" />
            {m["couriers.verification_approved"]()}
          </span>
        ) : (
          <button
            type="button"
            onClick={() => onApprove(item)}
            className="text-sm leading-[1.4] font-medium text-primary-500 underline underline-offset-2 hover:text-primary-600"
          >
            {m["couriers.verification_mark_approved"]()}
          </button>
        )}
      </div>
      {item.fileName !== null && <FileChip item={item} onView={() => onViewDocument(item)} />}
    </div>
  );
}

/** The uploaded-file chip — PNG badge, filename, and the outlined View action. */
function FileChip({item, onView}: {item: CourierVerificationItem; onView: () => void}) {
  return (
    <div className="mt-2 flex items-center gap-3 rounded-lg border border-grey-200 bg-white p-3">
      <CourierPngBadge />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium tracking-[0.14px] text-grey-800">{item.fileName}</p>
        <p className="text-xs tracking-[0.12px] text-grey-500">{m["couriers.verification_submitted"]()}</p>
      </div>
      <button
        type="button"
        onClick={onView}
        className="flex items-center gap-1.5 rounded-md border border-primary-500 px-3 py-1.5 text-sm font-medium text-primary-600 hover:bg-primary-50"
      >
        <Eye className="size-4" aria-hidden="true" />
        {m["couriers.verification_view"]()}
      </button>
    </div>
  );
}
