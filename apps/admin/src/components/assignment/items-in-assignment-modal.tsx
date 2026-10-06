import {useState} from "react";
import {Dialog, DialogBackdrop, DialogClose, DialogPopup, DialogPortal, DialogTitle} from "@alvo/ui";
import {cn} from "cnfast";
import {m} from "@/paraglide/messages";
import type {AssignmentDetail, AssignmentItemStatus} from "@/types/assignment-types";
import wlClose from "@/assets/wl-close.svg";
import wlSearch from "@/assets/wl-search.svg";
import {AssignmentItemPill, assignmentItemStatusLabel, ITEM_TONES} from "./assignment-item-pill";
import {AssignmentTypePill} from "./assignment-type-pill";

interface ItemsInAssignmentModalProps {
  detail: AssignmentDetail | null;
  onClose: () => void;
}

/** "Items in assignment" modal — count chips (order from the backend), route, parcel-ID search, item rows, count footer. */
export function ItemsInAssignmentModal({detail, onClose}: ItemsInAssignmentModalProps) {
  return (
    <Dialog open={detail !== null} onOpenChange={(next) => !next && onClose()}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup className="flex max-h-[calc(100vh-64px)] w-[560px] max-w-[calc(100vw-32px)] flex-col p-0">
          {detail && <ModalContent detail={detail} />}
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}

function ModalContent({detail}: {detail: AssignmentDetail}) {
  const [query, setQuery] = useState("");
  const items = detail.assignmentItems;
  const visible = items.filter((item) => item.id.toLowerCase().includes(query.toLowerCase()));
  return (
    <>
      <div className="flex items-start justify-between gap-4 px-6 pt-5">
        <div>
          <DialogTitle className="text-sm leading-[1.4] tracking-[0.14px] text-grey-500">{m["assignment.items_title"]()}</DialogTitle>
          <div className="flex items-center gap-2 pt-0.5">
            <span className="text-base leading-[1.4] font-semibold text-black">{detail.id}</span>
            <AssignmentTypePill type={detail.type} />
          </div>
        </div>
        <DialogClose className="rounded p-0.5 text-grey-600 hover:bg-grey-100" aria-label={m["workloads.close"]()}>
          <img src={wlClose} alt="" className="size-6" aria-hidden="true" />
        </DialogClose>
      </div>
      <div className="flex flex-col gap-3 px-6 pt-4">
        <StatusChips detail={detail} />
        <p className="rounded-lg bg-grey-100 px-3 py-2 text-sm leading-[1.4] tracking-[0.14px] text-black">
          <span className="text-grey-500">{m["assignment.items_route_label"]()}</span> {detail.route}
        </p>
        <div className="relative">
          <img src={wlSearch} alt="" className="absolute top-1/2 left-3 size-4 -translate-y-1/2" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={m["assignment.items_search"]()}
            className="w-full rounded-lg border border-grey-200 bg-white py-2.5 pr-3 pl-9 text-sm leading-[1.4] tracking-[0.14px] text-black placeholder:text-grey-400 focus:outline-2 focus:outline-primary-500"
          />
        </div>
      </div>
      <ItemRows items={visible} />
      <p className="px-6 py-3 text-center text-xs leading-[1.4] tracking-[0.12px] text-grey-500">
        {visible.length === 1
          ? m["assignment.items_showing_one"]({shown: visible.length, total: items.length})
          : m["assignment.items_showing"]({shown: visible.length, total: items.length})}
      </p>
    </>
  );
}

function ItemRows({items}: {items: AssignmentDetail["assignmentItems"]}) {
  return (
    <ol className="flex-1 overflow-y-auto px-6 py-3">
      {items.map((item) => (
        <li key={item.id} className="flex items-center gap-3 rounded-lg border border-grey-200 bg-white px-3 py-2.5 not-last:mb-2">
          <span className={cn("size-7 shrink-0 rounded-full", ITEM_TONES[item.status].dot)} aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{item.id}</p>
            <p className="text-xs leading-[1.4] tracking-[0.12px] text-grey-500">
              {item.slot} · {item.weightKg}kg
            </p>
          </div>
          <AssignmentItemPill status={item.status} />
        </li>
      ))}
      {items.length === 0 && <li className="py-8 text-center text-sm text-grey-500">{m["assignment.items_empty"]()}</li>}
    </ol>
  );
}

/** The count-summary chips across the top — backend supplies which statuses exist and their order. */
function StatusChips({detail}: {detail: AssignmentDetail}) {
  const counts = new Map<AssignmentItemStatus, number>();
  for (const item of detail.assignmentItems) counts.set(item.status, (counts.get(item.status) ?? 0) + 1);
  return (
    <div className="flex flex-wrap items-center gap-2">
      {detail.itemStatusOrder.map((status) => (
        <AssignmentItemPill key={status} status={status}>
          {counts.get(status) ?? 0} {assignmentItemStatusLabel(status)}
        </AssignmentItemPill>
      ))}
    </div>
  );
}
