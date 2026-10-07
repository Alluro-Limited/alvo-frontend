import {useState} from "react";
import type {SmeVerificationItem} from "@/types/smes-types";

/** Drawer/modal overlay state for the SMEs page — the doc viewer hands off to the review modal. */
export function useSmeOverlays() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [docItem, setDocItem] = useState<SmeVerificationItem | null>(null);
  const [reviewItem, setReviewItem] = useState<SmeVerificationItem | null>(null);

  return {
    openId,
    docItem,
    reviewItem,
    openDrawer: setOpenId,
    closeDrawer: () => setOpenId(null),
    openDoc: setDocItem,
    closeDoc: () => setDocItem(null),
    /** Review opens from "Mark Approved" on a row or from the doc viewer's Approve button. */
    openReview: (item: SmeVerificationItem) => {
      setDocItem(null);
      setReviewItem(item);
    },
    closeReview: () => setReviewItem(null),
  };
}
