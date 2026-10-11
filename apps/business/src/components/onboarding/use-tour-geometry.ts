import {useLayoutEffect, useRef, useState} from "react";
import type {TourTargetId} from "./onboarding-context";

export interface TourGeometry {
  rect: DOMRect;
  position: {top: number; left: number};
}

/**
 * Measures the spotlight target and tooltip after paint. The tooltip floats above
 * the stats grid (downward pointer) and sits right of sidebar items (left pointer).
 */
export function useTourGeometry(tourTargetId: TourTargetId | null, tourStep: number | null) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [geometry, setGeometry] = useState<TourGeometry | null>(null);

  useLayoutEffect(() => {
    if (!tourTargetId) return;
    const measure = () => {
      const target = document.querySelector(`[data-tour="${tourTargetId}"]`);
      const tip = tooltipRef.current;
      if (!target || !tip) return;
      const rect = target.getBoundingClientRect();
      const tipRect = tip.getBoundingClientRect();
      const position =
        tourTargetId === "stats"
          ? {top: rect.top - tipRect.height - 10, left: rect.left + rect.width / 2 - tipRect.width / 2}
          : {top: rect.top + rect.height / 2 - tipRect.height / 2, left: rect.right + 14};
      setGeometry({rect, position});
    };
    const frame = requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", measure);
    };
  }, [tourTargetId, tourStep]);

  return {tooltipRef, geometry};
}
