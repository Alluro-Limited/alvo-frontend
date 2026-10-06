import {useEffect} from "react";
import {createPortal} from "react-dom";
import wlXWhite from "@/assets/wl-x-white.svg";
import {m} from "@/paraglide/messages";

const TOAST_MS = 5000;

/** Dark bottom-right toast ("PRV-88190 flagged, system admin notified"). Portaled so it stays
 *  visible — visually and to screen readers — while the drawer or modal is open. Auto-dismisses. */
export function WorkloadsToast({message, onDismiss}: {message: string; onDismiss: () => void}) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, TOAST_MS);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div role="status" className="fixed right-6 bottom-6 z-50 flex items-center gap-3 rounded-lg bg-black px-4 py-3 shadow-lg">
      <p className="text-sm leading-[1.4] font-medium tracking-[0.14px] text-white">{message}</p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label={m["workloads.flag_toast_dismiss"]()}
        className="flex items-center rounded p-0.5 hover:bg-white/10"
      >
        <img src={wlXWhite} alt="" className="size-4" aria-hidden="true" />
      </button>
    </div>,
    document.body
  );
}
