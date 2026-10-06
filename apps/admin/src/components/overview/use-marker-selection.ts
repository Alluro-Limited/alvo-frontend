import {useCallback, useRef, useState} from "react";
import type {OverviewMap} from "@/types/dashboard-types";
import type {MapFilter, MarkerSelection} from "./map-sync";
import {useDelayedClose} from "./use-delayed-close";

export type SelectionKey = Pick<MarkerSelection, "kind" | "id">;

/** Grace window to cross the gap between marker and card before the popover closes. */
const CLOSE_DELAY_MS = 250;
const CARD_ZONE = "card";

interface MarkerSelectionState {
  /** The hovered marker's identity — what the popover renders for. */
  selection: SelectionKey | null;
  /** The marker's live position resolved from the latest data — the popover's anchor. */
  anchor: [number, number] | null;
  /** Marker hover/focus entered — opens immediately and cancels any pending close. */
  open: (selection: SelectionKey) => void;
  /** Marker hover/focus left — schedules the close unless the pointer already moved on. */
  leave: (selection: SelectionKey) => void;
  /** Cursor entered the popover card — keeps it open. */
  enterCard: () => void;
  /** Cursor left the popover card — schedules the close unless the pointer moved to a marker. */
  leaveCard: () => void;
  /** Close right away — Escape key or the card's close button. */
  clear: () => void;
}

function isHiddenByFilter(selection: SelectionKey, filter: MapFilter): boolean {
  return (filter === "nodes" && selection.kind === "courier") || (filter === "couriers" && selection.kind === "node");
}

const zoneKey = (selection: SelectionKey) => `${selection.kind}:${selection.id}`;

/**
 * Tracks which map marker is hovered. Pointer events fire `enter` on the new
 * target before `leave` on the old one, so a `zone` ref records where the cursor
 * actually is; a `leave` that arrives after the zone moved on is ignored. The
 * anchor re-resolves against the latest data each render, so the popover follows
 * marker moves on every poll and unmounts when the marker disappears or the
 * active filter hides it.
 */
export function useMarkerSelection(data: OverviewMap, filter: MapFilter): MarkerSelectionState {
  const [selection, setSelection] = useState<SelectionKey | null>(null);
  const zone = useRef<string | null>(null);
  const {schedule, cancel} = useDelayedClose(
    useCallback(() => setSelection(null), []),
    CLOSE_DELAY_MS
  );

  const leaveZone = useCallback(
    (key: string) => {
      if (zone.current !== key) return;
      zone.current = null;
      schedule();
    },
    [schedule]
  );

  const open = useCallback(
    (next: SelectionKey) => {
      zone.current = zoneKey(next);
      cancel();
      setSelection(next);
    },
    [cancel]
  );

  const leave = useCallback((prev: SelectionKey) => leaveZone(zoneKey(prev)), [leaveZone]);
  const enterCard = useCallback(() => {
    zone.current = CARD_ZONE;
    cancel();
  }, [cancel]);
  const leaveCard = useCallback(() => leaveZone(CARD_ZONE), [leaveZone]);
  const clear = useCallback(() => {
    zone.current = null;
    cancel();
    setSelection(null);
  }, [cancel]);

  const list = selection?.kind === "node" ? data.nodes : data.couriers;
  const marker = !selection || isHiddenByFilter(selection, filter) ? null : (list.find((m) => m.id === selection.id) ?? null);

  return {selection, anchor: marker?.position ?? null, open, leave, enterCard, leaveCard, clear};
}
