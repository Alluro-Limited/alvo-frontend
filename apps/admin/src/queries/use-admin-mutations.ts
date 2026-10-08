import {useMutation, useQueryClient} from "@tanstack/react-query";
import {adminsService} from "@/services/admins-service";
import type {InviteAdminInput, UpdateAdminInput} from "@/types/admins-types";

/** Sends an invite — the new admin lands in the list with the Invited pill. */
export function useInviteAdminMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: InviteAdminInput) => adminsService.inviteAdmin(input),
    onSuccess: () => queryClient.invalidateQueries({queryKey: ["admins"]}),
  });
}

/** Saves account info + role/permission changes from the edit dialog. */
export function useUpdateAdminMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({id, input}: {id: string; input: UpdateAdminInput}) => adminsService.updateAdmin(id, input),
    onSuccess: () => queryClient.invalidateQueries({queryKey: ["admins"]}),
  });
}

/** Suspends the admin — they lose dashboard access until reactivated. */
export function useSuspendAdminMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminsService.suspendAdmin(id),
    onSuccess: () => queryClient.invalidateQueries({queryKey: ["admins"]}),
  });
}

/** Restores a suspended admin's access with their last role permissions. */
export function useReactivateAdminMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminsService.reactivateAdmin(id),
    onSuccess: () => queryClient.invalidateQueries({queryKey: ["admins"]}),
  });
}

/** Permanently deletes the admin account — history stays in audit logs. */
export function useDeleteAdminMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminsService.deleteAdmin(id),
    onSuccess: () => queryClient.invalidateQueries({queryKey: ["admins"]}),
  });
}
