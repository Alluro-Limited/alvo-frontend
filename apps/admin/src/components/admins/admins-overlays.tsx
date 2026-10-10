import {m} from "@/paraglide/messages";
import type {AdminListResponse} from "@/types/admins-types";
import {useAdminDetailQuery} from "@/queries/use-admins-query";
import {
  useDeleteAdminMutation,
  useInviteAdminMutation,
  useReactivateAdminMutation,
  useSuspendAdminMutation,
  useUpdateAdminMutation,
} from "@/queries/use-admin-mutations";
import {AppToast} from "@/components/app-toast";
import type {useAdminsOverlays} from "./use-admins-overlays";
import {AdminActionDialog} from "./admin-action-dialog";
import {AdminDrawer} from "./admin-drawer";
import {EditAdminDialog} from "./edit-admin-dialog";
import {InviteAdminDrawer} from "./invite-admin-drawer";

type Overlays = ReturnType<typeof useAdminsOverlays>;

interface AdminsOverlaysProps {
  overlays: Overlays;
  data: AdminListResponse | undefined;
}

/** The invite drawer, detail drawer, edit dialog, action confirmations, and the success toast. */
export function AdminsOverlays({overlays, data}: AdminsOverlaysProps) {
  const roles = data?.roles ?? [];
  return (
    <>
      <InviteOverlay overlays={overlays} roles={roles} />
      <AdminDrawer
        adminId={overlays.drawerId}
        onClose={overlays.closeDrawer}
        onEdit={overlays.openEdit}
        onSuspend={overlays.openSuspend}
        onReactivate={overlays.openReactivate}
        onDelete={overlays.openDelete}
      />
      <EditOverlay overlays={overlays} roles={roles} />
      <ActionOverlay overlays={overlays} />
      {overlays.toast && <AppToast message={overlays.toast} variant="success" onDismiss={overlays.dismissToast} />}
    </>
  );
}

function InviteOverlay({overlays, roles}: {overlays: Overlays; roles: AdminListResponse["roles"]}) {
  const invite = useInviteAdminMutation();
  return (
    <InviteAdminDrawer
      open={overlays.inviteOpen}
      roles={roles}
      submitting={invite.isPending}
      failed={invite.isError && overlays.inviteOpen}
      onClose={overlays.closeInvite}
      onSubmit={(input) =>
        invite.mutate(input, {
          onSuccess: () => {
            overlays.closeInvite();
            overlays.showToast(m["admins.toast_invited"]());
          },
        })
      }
    />
  );
}

function EditOverlay({overlays, roles}: {overlays: Overlays; roles: AdminListResponse["roles"]}) {
  const detail = useAdminDetailQuery(overlays.editId);
  const update = useUpdateAdminMutation();
  return (
    <EditAdminDialog
      detail={detail.data ?? null}
      roles={roles}
      submitting={update.isPending}
      failed={update.isError && overlays.editId !== null}
      onClose={overlays.closeEdit}
      onSubmit={(input) =>
        overlays.editId !== null &&
        update.mutate(
          {id: overlays.editId, input},
          {
            onSuccess: () => {
              overlays.closeEdit();
              overlays.showToast(m["admins.toast_updated"]());
            },
          }
        )
      }
    />
  );
}

function ActionOverlay({overlays}: {overlays: Overlays}) {
  const suspend = useSuspendAdminMutation();
  const reactivate = useReactivateAdminMutation();
  const remove = useDeleteAdminMutation();
  const kind = overlays.action?.kind ?? null;
  const mutation = kind === "suspend" ? suspend : kind === "reactivate" ? reactivate : remove;
  const toastKey =
    kind === "suspend" ? m["admins.toast_suspended"] : kind === "reactivate" ? m["admins.toast_reactivated"] : m["admins.toast_deleted"];
  return (
    <AdminActionDialog
      kind={kind}
      submitting={mutation.isPending}
      failed={mutation.isError && overlays.action !== null}
      onClose={overlays.closeAction}
      onConfirm={() =>
        overlays.action !== null &&
        mutation.mutate(overlays.action.id, {
          onSuccess: () => {
            overlays.closeAction();
            overlays.closeDrawer();
            overlays.showToast(toastKey());
          },
        })
      }
    />
  );
}
