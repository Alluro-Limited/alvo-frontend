import {useState} from "react";
import type {AdminActionKind} from "./admin-action-dialog";

/** Drawer/dialog/toast state for the admins console — one open target per surface. */
export function useAdminsOverlays() {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [drawerId, setDrawerId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [action, setAction] = useState<{kind: AdminActionKind; id: string} | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  return {
    inviteOpen,
    drawerId,
    editId,
    action,
    toast,
    openInvite: () => setInviteOpen(true),
    closeInvite: () => setInviteOpen(false),
    openDrawer: setDrawerId,
    closeDrawer: () => setDrawerId(null),
    openEdit: setEditId,
    closeEdit: () => setEditId(null),
    openSuspend: (id: string) => setAction({kind: "suspend", id}),
    openReactivate: (id: string) => setAction({kind: "reactivate", id}),
    openDelete: (id: string) => setAction({kind: "delete", id}),
    closeAction: () => setAction(null),
    showToast: setToast,
    dismissToast: () => setToast(null),
  };
}
