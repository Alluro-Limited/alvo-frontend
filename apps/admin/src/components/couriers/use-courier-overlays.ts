import {useState} from "react";
import type {CourierDetail} from "@/types/couriers-types";
import type {DocTarget} from "./courier-doc-viewer";

/** Drawer, history-modal, and document-viewer overlay state for the couriers page. */
export function useCourierOverlays() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [historyDetail, setHistoryDetail] = useState<CourierDetail | null>(null);
  const [docTarget, setDocTarget] = useState<DocTarget | null>(null);

  return {
    openId,
    historyDetail,
    docTarget,
    openDrawer: setOpenId,
    closeDrawer: () => setOpenId(null),
    openHistory: setHistoryDetail,
    closeHistory: () => setHistoryDetail(null),
    openDoc: setDocTarget,
    closeDoc: () => setDocTarget(null),
  };
}
