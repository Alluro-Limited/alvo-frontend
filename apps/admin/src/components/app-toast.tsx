import {useEffect} from "react";
import {createPortal} from "react-dom";
import {CheckCircle2} from "lucide-react";
import {cn} from "cnfast";
import wlXWhite from "@/assets/wl-x-white.svg";
import {m} from "@/paraglide/messages";

const TOAST_MS = 5000;

interface AppToastProps {
  message: string;
  onDismiss: () => void;
  /** "success" renders the dark-teal confirmation toast with a check icon (e.g. "account suspended"). */
  variant?: "default" | "success";
}

/** Dark bottom-right toast shared by every surface ("New node registered...", "PRV-88190 flagged...").
 *  Portaled so it stays visible — visually and to screen readers — while a drawer or modal is open. Auto-dismisses. */
export function AppToast({message, onDismiss, variant = "default"}: AppToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, TOAST_MS);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      role="status"
      className={cn(
        "fixed right-6 bottom-6 z-50 flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg",
        variant === "success" ? "bg-primary-800" : "bg-black"
      )}
    >
      {variant === "success" && <CheckCircle2 className="size-4 shrink-0 text-white" aria-hidden="true" />}
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
