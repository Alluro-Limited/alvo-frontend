import {useState} from "react";
import {m} from "@/paraglide/messages";
import {useFlagParcelsMutation} from "@/queries/use-flag-parcels-mutation";
import type {FlagReason} from "./flag-reasons";

/** Single-parcel and bulk flag flow: which ids are targeted, the mutation, and the success toast. */
export function useFlagFlow(onSuccess: () => void) {
  const [flagIds, setFlagIds] = useState<string[] | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const mutation = useFlagParcelsMutation();

  const submit = (reason: FlagReason, notes: string) => {
    if (!flagIds) return;
    mutation.mutate(
      {ids: flagIds, reason, notes: notes || undefined},
      {
        onSuccess: () => {
          setToast(m["workloads.flag_toast"]({ids: flagIds.join(", ")}));
          setFlagIds(null);
          onSuccess();
        },
      }
    );
  };

  return {
    flagIds,
    openFlag: setFlagIds,
    closeFlag: () => setFlagIds(null),
    submit,
    submitting: mutation.isPending,
    failed: mutation.isError,
    toast,
    dismissToast: () => setToast(null),
  };
}
