import {useState} from "react";
import {m} from "@/paraglide/messages";
import {useDeleteCourierMutation} from "@/queries/use-delete-courier-mutation";
import type {CourierDeleteReason, CourierDetail} from "@/types/couriers-types";

/** Delete-account flow: the targeted courier, the mutation, and the success toast. */
export function useCourierDeleteFlow(onSuccess: () => void) {
  const [detail, setDetail] = useState<CourierDetail | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const mutation = useDeleteCourierMutation();

  const confirm = (reason: CourierDeleteReason) => {
    if (!detail) return;
    const {id, name} = detail;
    mutation.mutate(
      {id, input: {reason}},
      {
        onSuccess: () => {
          setToast(m["couriers.deleted_toast"]({name}));
          setDetail(null);
          onSuccess();
        },
      }
    );
  };

  return {
    detail,
    openDelete: setDetail,
    closeDelete: () => setDetail(null),
    confirm,
    submitting: mutation.isPending,
    failed: mutation.isError,
    toast,
    dismissToast: () => setToast(null),
  };
}
