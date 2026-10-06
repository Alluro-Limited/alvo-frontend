import {useEffect, useLayoutEffect, useRef, useState, type ReactNode} from "react";

/** The slice of the MapLibre instance the popover needs — keeps it testable without a real map. */
export interface PopoverMapHandle {
  project: (position: [number, number]) => {x: number; y: number};
  on: (event: "move", listener: () => void) => void;
  off: (event: "move", listener: () => void) => void;
  getContainer: () => HTMLElement;
}

const CARD_WIDTH = 260;
const MARKER_RADIUS = 24;
const GAP = 6;
const EDGE_MARGIN = 8;

interface MarkerPopoverProps {
  map: PopoverMapHandle;
  /** Marker position as [longitude, latitude]. */
  anchor: [number, number];
  onClose: () => void;
  /** Hover-bridge hooks so the card stays open while the cursor is on it. */
  onEnter: () => void;
  onLeave: () => void;
  children: ReactNode;
}

/**
 * A 260px card anchored to a map marker: sits beside the marker, flips left
 * near the right edge, clamps inside the map vertically, tracks map pans/zooms,
 * and closes on Escape.
 */
export function MarkerPopover({map, anchor, onClose, onEnter, onLeave, children}: MarkerPopoverProps) {
  const [pos, setPos] = useState(() => map.project(anchor));
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardHeight, setCardHeight] = useState(0);

  useEffect(() => {
    const update = () => setPos(map.project(anchor));
    update();
    map.on("move", update);
    return () => map.off("move", update);
  }, [map, anchor]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  useLayoutEffect(() => {
    setCardHeight(cardRef.current?.offsetHeight ?? 0);
  });

  const width = map.getContainer().clientWidth;
  const fitsRight = pos.x + MARKER_RADIUS + GAP + CARD_WIDTH + EDGE_MARGIN <= width;
  const cardX = fitsRight ? pos.x + MARKER_RADIUS + GAP : pos.x - MARKER_RADIUS - GAP - CARD_WIDTH;
  const clampedCenterY = Math.min(
    Math.max(pos.y, cardHeight / 2 + EDGE_MARGIN),
    map.getContainer().clientHeight - cardHeight / 2 - EDGE_MARGIN
  );

  return (
    <div className="pointer-events-none absolute inset-0 z-10" data-testid="marker-popover">
      <div
        ref={cardRef}
        className="pointer-events-auto absolute"
        style={{left: cardX, top: clampedCenterY}}
        onPointerEnter={onEnter}
        onPointerLeave={onLeave}
      >
        <div className="w-[260px] -translate-y-1/2 overflow-clip rounded-2xl border-[0.75px] border-grey-300 bg-white shadow-[0_0_10px_4px_rgba(0,0,0,0.03)]">
          {children}
        </div>
      </div>
    </div>
  );
}
