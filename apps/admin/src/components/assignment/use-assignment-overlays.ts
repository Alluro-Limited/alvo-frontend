import {useState} from "react";
import type {AssignmentDetail} from "@/types/assignment-types";

/** Drawer/items-modal/manual-assign overlay state for the assignment page. */
export function useAssignmentOverlays() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [itemsDetail, setItemsDetail] = useState<AssignmentDetail | null>(null);
  const [assign, setAssign] = useState<{open: boolean; preselect: string | null}>({open: false, preselect: null});
  const [assignToast, setAssignToast] = useState<string | null>(null);

  return {
    openId,
    itemsDetail,
    assign,
    assignToast,
    openDrawer: setOpenId,
    closeDrawer: () => setOpenId(null),
    openItems: setItemsDetail,
    closeItems: () => setItemsDetail(null),
    openAssign: (preselect: string | null) => setAssign({open: true, preselect}),
    closeAssign: () => setAssign({open: false, preselect: null}),
    showAssignToast: setAssignToast,
    dismissAssignToast: () => setAssignToast(null),
  };
}
