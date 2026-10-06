import {useState} from "react";
import {m} from "@/paraglide/messages";
import {useFlagAssignmentsMutation} from "@/queries/use-flag-assignment-mutation";
import type {FlagReason} from "@/components/workloads/flag-reasons";

/** Single and bulk assignment flag flow: the targeted ids, the mutation, and the success toast. */
export function useAssignmentFlagFlow(onSuccess: () => void) {
  const [flagIds, setFlagIds] = useState<string[] | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const mutation = useFlagAssignmentsMutation();

  const submit = (reason: FlagReason, notes: string) => {
    if (!flagIds) return;
    const ids = flagIds;
    mutation.mutate(
      {ids, reason, notes: notes || undefined},
      {
        onSuccess: () => {
          setToast(ids.length === 1 ? m["assignment.flag_toast"]({id: ids[0]}) : m["workloads.flag_toast"]({ids: ids.join(", ")}));
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
