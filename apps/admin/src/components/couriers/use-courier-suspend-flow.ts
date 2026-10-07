import {useState} from "react";
import {m} from "@/paraglide/messages";
import {useSuspendCourierMutation} from "@/queries/use-suspend-courier-mutation";
import type {SuspendIntent} from "./suspend-courier-dialog";
import type {CourierDetail, CourierSuspendReason} from "@/types/couriers-types";

interface SuspendTarget {
  ids: string[];
  intent: SuspendIntent;
  /** Display name for the single-account toast — bulk falls back to the count. */
  name?: string;
}

/** Suspend/unsuspend flow: the targeted couriers, the mutation, and the success toast. */
export function useCourierSuspendFlow(onSuccess: () => void) {
  const [target, setTarget] = useState<SuspendTarget | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const mutation = useSuspendCourierMutation();

  const submit = (reason: CourierSuspendReason | null, notes: string) => {
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
                ? m["couriers.suspended_toast"]({name})
                : m["couriers.suspended_toast_multi"]({count: ids.length})
              : m["couriers.unsuspended_toast"]({name: name ?? ids[0]})
          );
          setTarget(null);
          onSuccess();
        },
      }
    );
  };

  return {
    target,
    openSuspend: (detail: CourierDetail) =>
      setTarget({ids: [detail.id], intent: detail.status === "suspended" ? "unsuspend" : "suspend", name: detail.name}),
    openBulkSuspend: (ids: string[]) => setTarget({ids, intent: "suspend"}),
    closeSuspend: () => setTarget(null),
    submit,
    submitting: mutation.isPending,
    failed: mutation.isError,
    toast,
    dismissToast: () => setToast(null),
  };
}
