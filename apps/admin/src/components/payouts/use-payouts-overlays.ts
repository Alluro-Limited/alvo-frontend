import {useState} from "react";

/** Dialog/drawer/toast state for the payout console — one open target per surface. */
export function usePayoutsOverlays() {
  const [drawerId, setDrawerId] = useState<string | null>(null);
  const [markPaidId, setMarkPaidId] = useState<string | null>(null);
  const [batchOpen, setBatchOpen] = useState(false);
  const [withholdId, setWithholdId] = useState<string | null>(null);
  const [flagId, setFlagId] = useState<string | null>(null);
  const [deliveriesId, setDeliveriesId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  return {
    drawerId,
    markPaidId,
    batchOpen,
    withholdId,
    flagId,
    deliveriesId,
    toast,
    openDrawer: setDrawerId,
    closeDrawer: () => setDrawerId(null),
    openMarkPaid: setMarkPaidId,
    closeMarkPaid: () => setMarkPaidId(null),
    openBatch: () => setBatchOpen(true),
    closeBatch: () => setBatchOpen(false),
    openWithhold: setWithholdId,
    closeWithhold: () => setWithholdId(null),
    openFlag: setFlagId,
    closeFlag: () => setFlagId(null),
    openDeliveries: setDeliveriesId,
    closeDeliveries: () => setDeliveriesId(null),
    showToast: setToast,
    dismissToast: () => setToast(null),
  };
}
