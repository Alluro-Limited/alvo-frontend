import {useCallback, useEffect, useRef} from "react";

interface DelayedClose {
  /** Start (or restart) the countdown to `onClose`. */
  schedule: () => void;
  /** Cancel a pending close — e.g. the pointer moved back onto the target. */
  cancel: () => void;
}

/** A cancellable delayed callback, used for hover-intent close delays. `onClose` must be stable. */
export function useDelayedClose(onClose: () => void, delayMs: number): DelayedClose {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  const cancel = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  const schedule = useCallback(() => {
    cancel();
    timer.current = setTimeout(onClose, delayMs);
  }, [cancel, onClose, delayMs]);

  return {schedule, cancel};
}
