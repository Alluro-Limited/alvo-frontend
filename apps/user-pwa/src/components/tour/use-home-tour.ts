import {useState} from "react";
import {TOUR_STEPS} from "./tour-steps";

const SEEN_KEY = "alvo.home-tour-seen";

type TourPhase = "welcome" | number | null;

/**
 * First-visit home tour: welcome sheet → numbered coach-mark steps → done.
 * Completion (or skip) is persisted so the tour only plays once per browser.
 */
export function useHomeTour() {
  const [phase, setPhase] = useState<TourPhase>(() =>
    typeof window !== "undefined" && window.localStorage.getItem(SEEN_KEY) ? null : "welcome"
  );

  const finish = () => {
    window.localStorage.setItem(SEEN_KEY, "1");
    setPhase(null);
  };

  const next = () => {
    if (typeof phase === "number" && phase >= TOUR_STEPS.length - 1) {
      finish();
      return;
    }
    setPhase(typeof phase === "number" ? phase + 1 : phase);
  };

  return {phase, startTour: () => setPhase(0), next, finish};
}
