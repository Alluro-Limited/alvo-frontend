import {useState} from "react";
import {m} from "@/paraglide/messages";
import {useRegisterNodeMutation} from "@/queries/use-register-node-mutation";
import type {RegisterNodeInput} from "@/types/nodes-types";

/** Register wizard state + mutation + the success toast, in one hook the page consumes. */
export function useRegisterFlow() {
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const register = useRegisterNodeMutation();

  const close = () => {
    setOpen(false);
    register.reset();
  };

  const submit = (input: RegisterNodeInput) =>
    register.mutate(input, {
      onSuccess: () => {
        setOpen(false);
        setToast(m["nodes.registered_toast"]());
      },
    });

  return {
    open,
    toast,
    openWizard: () => setOpen(true),
    close,
    submit,
    dismissToast: () => setToast(null),
    submitting: register.isPending,
    failed: register.isError,
  };
}
