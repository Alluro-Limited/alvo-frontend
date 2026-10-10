import {useState} from "react";
import {m} from "@/paraglide/messages";
import {useSuspendSmeMutation} from "@/queries/use-suspend-sme-mutation";
import type {SmeSuspendReason} from "@/types/smes-types";
import type {SmeSuspendIntent} from "./suspend-sme-dialog";

interface SuspendTarget {
  ids: string[];
  intent: SmeSuspendIntent;
  /** Display name for the single-account copy and toast — bulk falls back to the count. */
  name?: string;
}

/** Suspend/unsuspend flow: the targeted accounts, the mutation, and the success toast. */
export function useSmeSuspendFlow(onSuccess: () => void) {
  const [target, setTarget] = useState<SuspendTarget | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const mutation = useSuspendSmeMutation();

  const submit = (reason: SmeSuspendReason | null, notes: string) => {
    if (!target) return;
    const {ids, intent, name} = target;
    mutation.mutate(
      {ids, intent, reason: reason ?? undefined, notes: notes || undefined},
      {
        onSuccess: () => {
          const single = ids.length === 1 && name;
          setToast(
            intent === "suspend"
              ? single
                ? m["smes.suspended_toast"]({name})
                : m["smes.suspended_toast_multi"]({count: ids.length})
              : m["smes.unsuspended_toast"]({name: name ?? ids[0]})
          );
          setTarget(null);
          onSuccess();
        },
      }
    );
  };

  return {
    target,
    openSuspend: (id: string, name: string, suspended: boolean) =>
      setTarget({ids: [id], intent: suspended ? "unsuspend" : "suspend", name}),
    openBulkSuspend: (ids: string[]) => setTarget({ids, intent: "suspend"}),
    closeSuspend: () => setTarget(null),
    submit,
    submitting: mutation.isPending,
    failed: mutation.isError,
    toast,
    dismissToast: () => setToast(null),
  };
}
