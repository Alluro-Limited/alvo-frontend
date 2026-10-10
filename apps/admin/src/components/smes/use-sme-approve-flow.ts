import {useState} from "react";
import {m} from "@/paraglide/messages";
import {useApproveSmeVerificationMutation} from "@/queries/use-approve-sme-verification-mutation";
import type {SmeVerificationItem} from "@/types/smes-types";

interface ApproveTarget {
  smeId: string;
  item: SmeVerificationItem;
}

/** Verification-approval flow behind the review modal — the item under review plus the mutation. */
export function useSmeApproveFlow() {
  const [target, setTarget] = useState<ApproveTarget | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const mutation = useApproveSmeVerificationMutation();

  const approve = () => {
    if (!target) return;
    const {smeId, item} = target;
    mutation.mutate(
      {id: smeId, itemKey: item.key},
      {
        onSuccess: () => {
          setToast(m["smes.approve_toast"]({label: item.label}));
          setTarget(null);
        },
      }
    );
  };

  return {
    /** The item currently in the review modal — null closes it. */
    item: target?.item ?? null,
    openReview: (smeId: string, item: SmeVerificationItem) => setTarget({smeId, item}),
    closeReview: () => setTarget(null),
    approve,
    submitting: mutation.isPending,
    failed: mutation.isError,
    toast,
    dismissToast: () => setToast(null),
  };
}
