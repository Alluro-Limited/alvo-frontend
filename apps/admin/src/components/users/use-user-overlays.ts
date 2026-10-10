import {useState} from "react";
import type {UserDetail} from "@/types/users-types";

/** Drawer and parcels-modal overlay state for the users page. */
export function useUserOverlays() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [parcelsDetail, setParcelsDetail] = useState<UserDetail | null>(null);

  return {
    openId,
    parcelsDetail,
    openDrawer: setOpenId,
    closeDrawer: () => setOpenId(null),
    openParcels: setParcelsDetail,
    closeParcels: () => setParcelsDetail(null),
  };
}
