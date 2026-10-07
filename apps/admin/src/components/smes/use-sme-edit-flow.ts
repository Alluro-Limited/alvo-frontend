import {useState} from "react";
import {m} from "@/paraglide/messages";
import {useUpdateSmeMutation} from "@/queries/use-update-sme-mutation";
import type {SmeDetail, SmeUpdateInput} from "@/types/smes-types";

/** Edit-info flow: the open modal's detail, the mutation, and the success toast. */
export function useSmeEditFlow() {
  const [detail, setDetail] = useState<SmeDetail | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const mutation = useUpdateSmeMutation();

  const submit = (input: SmeUpdateInput) => {
    if (!detail) return;
    mutation.mutate(
      {id: detail.id, input},
      {
        onSuccess: () => {
          setToast(m["smes.edit_saved_toast"]());
          setDetail(null);
        },
      }
    );
  };

  return {
    detail,
    openEdit: setDetail,
    closeEdit: () => setDetail(null),
    submit,
    submitting: mutation.isPending,
    failed: mutation.isError,
    toast,
    dismissToast: () => setToast(null),
  };
}
