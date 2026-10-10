import {useState} from "react";
import {m} from "@/paraglide/messages";
import {useDeactivateSmeMutation} from "@/queries/use-deactivate-sme-mutation";
import type {SmeDeactivateReason} from "@/types/smes-types";

interface DeactivateTarget {
  id: string;
  name: string;
}

/** Deactivation flow: the targeted account, the mutation, and the destructive success toast. */
export function useSmeDeactivateFlow(onSuccess: () => void) {
  const [target, setTarget] = useState<DeactivateTarget | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const mutation = useDeactivateSmeMutation();

  const submit = (reason: SmeDeactivateReason) => {
    if (!target) return;
    const {id, name} = target;
    mutation.mutate(
      {id, input: {reason}},
      {
        onSuccess: () => {
          setToast(m["smes.deactivated_toast"]({name}));
          setTarget(null);
          onSuccess();
        },
      }
    );
  };

  return {
    target,
    openDeactivate: (id: string, name: string) => setTarget({id, name}),
    closeDeactivate: () => setTarget(null),
    submit,
    submitting: mutation.isPending,
    failed: mutation.isError,
    toast,
    dismissToast: () => setToast(null),
  };
}
