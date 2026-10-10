import {useState} from "react";
import {m} from "@/paraglide/messages";
import {useFlagSmesMutation} from "@/queries/use-flag-smes-mutation";
import type {FlagReason} from "@/components/workloads/flag-reasons";

interface FlagTarget {
  ids: string[];
  /** Display name for the single-account description — bulk omits it. */
  name?: string;
}

/** Single and bulk SME flag flow: the targeted ids, the mutation, and the success toast. */
export function useSmeFlagFlow(onSuccess: () => void) {
  const [target, setTarget] = useState<FlagTarget | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const mutation = useFlagSmesMutation();

  const submit = (reason: FlagReason, notes: string) => {
    if (!target) return;
    const {ids} = target;
    mutation.mutate(
      {ids, reason, notes: notes || undefined},
      {
        onSuccess: () => {
          setToast(m["smes.flagged_toast"]({ids: ids.join(", ")}));
          setTarget(null);
          onSuccess();
        },
      }
    );
  };

  return {
    flagIds: target?.ids ?? null,
    /** The single-target business name for the dialog's description copy. */
    flagName: target?.ids.length === 1 ? target.name : undefined,
    openFlag: (ids: string | string[], name?: string) => setTarget({ids: Array.isArray(ids) ? ids : [ids], name}),
    closeFlag: () => setTarget(null),
    submit,
    submitting: mutation.isPending,
    failed: mutation.isError,
    toast,
    dismissToast: () => setToast(null),
  };
}
