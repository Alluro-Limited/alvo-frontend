import {BadgeCheck, Copy, Eye, FileText} from "lucide-react";
import {m} from "@/paraglide/messages";
import type {SmeDetail, SmeVerificationItem} from "@/types/smes-types";
import {SmeDrawerCard} from "./sme-drawer-card";

interface SmeVerificationTabProps {
  detail: SmeDetail;
  onViewDocument: (item: SmeVerificationItem) => void;
  onApprove: (item: SmeVerificationItem) => void;
}

/** Verification tab: the signup CAC number plus the reviewable verification items. */
export function SmeVerificationTab({detail, onViewDocument, onApprove}: SmeVerificationTabProps) {
  return (
    <div className="flex flex-col gap-4">
      <SmeDrawerCard title={m["smes.registration_title"]()}>
        <div className="rounded-lg border border-grey-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs tracking-[0.12px] text-grey-500">{m["smes.registration_cac_label"]()}</p>
            <p className="text-xs tracking-[0.12px] text-grey-400">{m["smes.registration_signup_note"]()}</p>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <p className="text-base font-medium tracking-[0.16px] text-grey-900">{detail.cacNumber}</p>
            <button
              type="button"
              onClick={() => void navigator.clipboard?.writeText(detail.cacNumber)}
              className="text-primary-500 hover:text-primary-600"
              aria-label={m["smes.cac_copy_aria"]()}
            >
              <Copy className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </SmeDrawerCard>
      <SmeDrawerCard title={m["smes.verification_title"]()}>
        <div className="flex flex-col gap-4">
          {detail.verificationItems.map((item) => (
            <VerificationRow key={item.key} item={item} onViewDocument={onViewDocument} onApprove={onApprove} />
          ))}
        </div>
      </SmeDrawerCard>
    </div>
  );
}

interface VerificationRowProps {
  item: SmeVerificationItem;
  onViewDocument: (item: SmeVerificationItem) => void;
  onApprove: (item: SmeVerificationItem) => void;
}

function VerificationRow({item, onViewDocument, onApprove}: VerificationRowProps) {
  const approved = item.status === "approved";
  return (
    <div>
      <div className="flex items-center justify-between pb-2">
        <p className="text-sm font-medium tracking-[0.14px] text-grey-800">{item.label}</p>
        {approved ? (
          <span className="flex items-center gap-1 text-sm font-medium text-primary-600">
            <BadgeCheck className="size-4" aria-hidden="true" />
            {m["smes.verification_approved"]()}
          </span>
        ) : (
          item.status === "submitted" && (
            <button
              type="button"
              onClick={() => onApprove(item)}
              className="text-sm font-medium text-primary-500 underline underline-offset-2 hover:text-primary-600"
            >
              {m["smes.verification_mark_approved"]()}
            </button>
          )
        )}
      </div>
      <ItemBody item={item} onViewDocument={() => onViewDocument(item)} />
    </div>
  );
}

/** The uploaded-file chip with the View action, or the dashed "Yet to upload" placeholder. */
function ItemBody({item, onViewDocument}: {item: SmeVerificationItem; onViewDocument: () => void}) {
  if (item.status === "not_uploaded" || item.fileName === null) {
    if (item.status !== "not_uploaded") return null;
    return (
      <div className="flex items-center justify-center rounded-lg border border-dashed border-grey-300 bg-white px-4 py-6 text-sm tracking-[0.14px] text-grey-400">
        {m["smes.verification_yet_to_upload"]()}
      </div>
    );
  }
  return (
    <div className="flex items-center gap-3 rounded-lg border border-grey-200 bg-white p-3">
      <span className="flex size-9 items-center justify-center rounded-md bg-status-fail-subtle text-status-fail-dark">
        <FileText className="size-5" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium tracking-[0.14px] text-grey-800">{item.fileName}</p>
        <p className="text-xs tracking-[0.12px] text-grey-500">{m["smes.verification_submitted"]()}</p>
      </div>
      <button
        type="button"
        onClick={onViewDocument}
        className="flex items-center gap-1.5 rounded-md border border-primary-500 px-3 py-1.5 text-sm font-medium text-primary-600 hover:bg-primary-50"
      >
        <Eye className="size-4" aria-hidden="true" />
        {m["smes.verification_view"]()}
      </button>
    </div>
  );
}
