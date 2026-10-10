import {useState} from "react";
import {Button, Checkbox, Dialog, DialogBackdrop, DialogClose, DialogPopup, DialogPortal, DialogTitle} from "@alvo/ui";
import {m} from "@/paraglide/messages";
import smeReviewShield from "@/assets/sme-review-shield.svg";
import wlClose from "@/assets/wl-close.svg";
import type {SmeVerificationItem} from "@/types/smes-types";

interface SmeReviewModalProps {
  /** The verification item under review — null closes the modal. */
  item: SmeVerificationItem | null;
  submitting: boolean;
  /** The last approval attempt failed — shows an inline error and keeps the form open. */
  failed: boolean;
  onClose: () => void;
  onApprove: () => void;
}

/** Review & Approve modal — every checklist line must be ticked before Approve unlocks. */
export function SmeReviewModal({item, submitting, failed, onClose, onApprove}: SmeReviewModalProps) {
  return (
    <Dialog open={item !== null} onOpenChange={(next) => !next && onClose()}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup className="w-[480px] max-w-[calc(100vw-32px)] p-6">
          {item !== null && (
            <ReviewForm key={item.key} item={item} submitting={submitting} failed={failed} onClose={onClose} onApprove={onApprove} />
          )}
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}

interface ReviewFormProps extends Omit<SmeReviewModalProps, "item"> {
  item: SmeVerificationItem;
}

function ReviewForm({item, submitting, failed, onClose, onApprove}: ReviewFormProps) {
  const [checked, setChecked] = useState<ReadonlySet<number>>(new Set());
  const canSubmit = item.checklist.length > 0 && item.checklist.every((_, i) => checked.has(i)) && !submitting;

  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-50">
            <img src={smeReviewShield} alt="" className="size-5" aria-hidden="true" />
          </span>
          <DialogTitle className="text-lg leading-[1.3] font-semibold text-black">
            {m["smes.review_title"]({label: item.label})}
          </DialogTitle>
        </div>
        <DialogClose className="rounded p-0.5 text-grey-600 hover:bg-grey-100" aria-label={m["workloads.close"]()}>
          <img src={wlClose} alt="" className="size-6" aria-hidden="true" />
        </DialogClose>
      </div>
      <p className="pt-5 pb-2 text-sm font-medium tracking-[0.14px] text-black">{m["smes.review_checklist"]()}</p>
      <Checklist lines={item.checklist} checked={checked} onChecked={setChecked} />
      <p className="mt-4 rounded-lg bg-grey-100 px-4 py-3 text-xs leading-[1.5] tracking-[0.12px] text-grey-600">
        {m["smes.review_disclaimer"]({label: item.label})}
      </p>
      {failed && <p className="pt-3 text-sm leading-[1.4] tracking-[0.14px] text-status-fail">{m["smes.review_error"]()}</p>}
      <div className="mt-6 flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onClose}>
          {m["smes.review_cancel"]()}
        </Button>
        <Button type="button" variant={canSubmit ? "default" : "disabled"} isLoading={submitting} onClick={() => canSubmit && onApprove()}>
          {submitting ? m["smes.review_confirming"]() : m["smes.review_confirm"]()}
        </Button>
      </div>
    </>
  );
}

function Checklist({lines, checked, onChecked}: {lines: string[]; checked: ReadonlySet<number>; onChecked: (next: Set<number>) => void}) {
  return (
    <div className="flex flex-col gap-3">
      {lines.map((line, i) => (
        <label key={line} className="flex cursor-pointer items-start gap-2.5 text-sm leading-[1.4] tracking-[0.14px] text-grey-700">
          <Checkbox
            checked={checked.has(i)}
            onCheckedChange={(next) => {
              const updated = new Set(checked);
              if (next === true) updated.add(i);
              else updated.delete(i);
              onChecked(updated);
            }}
            className="mt-0.5 size-4"
          />
          {line}
        </label>
      ))}
    </div>
  );
}
