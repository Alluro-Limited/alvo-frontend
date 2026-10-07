import {useState} from "react";
import {m} from "@/paraglide/messages";
import {useDeleteUserMutation} from "@/queries/use-delete-user-mutation";
import type {UserDetail} from "@/types/users-types";

/** Delete-account flow: the targeted user, the mutation, and the success toast. */
export function useUserDeleteFlow(onSuccess: () => void) {
  const [detail, setDetail] = useState<UserDetail | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const mutation = useDeleteUserMutation();

  const confirm = () => {
    if (!detail) return;
    const {id, name} = detail;
    mutation.mutate(id, {
      onSuccess: () => {
        setToast(m["users.deleted_toast"]({name}));
        setDetail(null);
        onSuccess();
      },
    });
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
