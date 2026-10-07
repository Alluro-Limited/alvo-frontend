import {useState} from "react";
import {m} from "@/paraglide/messages";
import type {FlagReason} from "@/components/workloads/flag-reasons";
import {useFlagCouriersMutation} from "@/queries/use-flag-couriers-mutation";

interface FlagTarget {
  ids: string[];
  /** Display name for the single-account toast — bulk falls back to the count. */
  name?: string;
}

/** Single and bulk courier flag flow: the targeted ids, the mutation, and the success toast. */
export function useCourierFlagFlow(onSuccess: () => void) {
  const [target, setTarget] = useState<FlagTarget | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const mutation = useFlagCouriersMutation();

  const submit = (reason: FlagReason, notes: string) => {
    if (!target) return;
    const {ids, name} = target;
    mutation.mutate(
      {ids, reason, notes: notes || undefined},
      {
        onSuccess: () => {
          setToast(ids.length === 1 && name ? m["couriers.flagged_toast"]({name}) : m["couriers.flagged_toast_multi"]({count: ids.length}));
          setTarget(null);
          onSuccess();
        },
      }
    );
  };

  return {
    flagIds: target?.ids ?? null,
    openFlag: (ids: string | string[], name?: string) => setTarget({ids: Array.isArray(ids) ? ids : [ids], name}),
    closeFlag: () => setTarget(null),
    submit,
    submitting: mutation.isPending,
    failed: mutation.isError,
    toast,
    dismissToast: () => setToast(null),
  };
}
