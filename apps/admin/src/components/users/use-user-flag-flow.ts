import {useState} from "react";
import {m} from "@/paraglide/messages";
import {useFlagUsersMutation} from "@/queries/use-flag-users-mutation";
import type {FlagReason} from "@/components/workloads/flag-reasons";

/** Single and bulk user flag flow: the targeted ids, the mutation, and the success toast. */
export function useUserFlagFlow(onSuccess: () => void) {
  const [flagIds, setFlagIds] = useState<string[] | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const mutation = useFlagUsersMutation();

  const submit = (reason: FlagReason, notes: string) => {
    if (!flagIds) return;
    const ids = flagIds;
    mutation.mutate(
      {ids, reason, notes: notes || undefined},
      {
        onSuccess: () => {
          setToast(m["users.flagged_toast"]({ids: ids.join(", ")}));
          setFlagIds(null);
          onSuccess();
        },
      }
    );
  };

  return {
    flagIds,
    openFlag: (ids: string | string[]) => setFlagIds(Array.isArray(ids) ? ids : [ids]),
    closeFlag: () => setFlagIds(null),
    submit,
    submitting: mutation.isPending,
    failed: mutation.isError,
    toast,
    dismissToast: () => setToast(null),
  };
}
