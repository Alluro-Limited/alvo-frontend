import {useState} from "react";
import {m} from "@/paraglide/messages";
import {useApproveCourierVerificationMutation} from "@/queries/use-approve-courier-verification-mutation";
import type {CourierVerificationItem} from "@/types/couriers-types";
import {VERIFICATION_ITEM_LABELS} from "./courier-labels";

/** Verification-approval flow — Mark Approved links and the doc viewer both approve through this. */
export function useCourierApproveFlow() {
  const [toast, setToast] = useState<string | null>(null);
  const mutation = useApproveCourierVerificationMutation();

  const approve = (id: string, item: CourierVerificationItem, onSuccess?: () => void) =>
    mutation.mutate(
      {id, itemKey: item.key},
      {
        onSuccess: () => {
          setToast(m["couriers.approve_toast"]({label: VERIFICATION_ITEM_LABELS[item.key]()}));
          onSuccess?.();
        },
      }
    );

  return {
    approve,
    approving: mutation.isPending,
    toast,
    dismissToast: () => setToast(null),
  };
}
