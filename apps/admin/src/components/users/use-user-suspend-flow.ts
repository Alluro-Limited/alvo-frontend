import {useState} from "react";
import {m} from "@/paraglide/messages";
import {useSuspendUserMutation} from "@/queries/use-suspend-user-mutation";
import type {SuspendIntent} from "./suspend-user-dialog";
import type {SuspendReason, UserDetail} from "@/types/users-types";

interface SuspendTarget {
  ids: string[];
  intent: SuspendIntent;
  /** Display name for the single-account toast — bulk falls back to the count. */
  name?: string;
}

/** Suspend/unsuspend flow: the targeted accounts, the mutation, and the success toast. */
export function useUserSuspendFlow(onSuccess: () => void) {
  const [target, setTarget] = useState<SuspendTarget | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const mutation = useSuspendUserMutation();

  const submit = (reason: SuspendReason | null, notes: string) => {
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
                ? m["users.suspended_toast"]({name})
                : m["users.suspended_toast_multi"]({count: ids.length})
              : m["users.unsuspended_toast"]({name: name ?? ids[0]})
          );
          setTarget(null);
          onSuccess();
        },
      }
    );
  };

  return {
    target,
    openSuspend: (detail: UserDetail) =>
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
