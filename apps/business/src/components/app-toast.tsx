import {useEffect} from "react";
import {createPortal} from "react-dom";
import {CheckCircle2, X} from "lucide-react";
import {cn} from "cnfast";
import {m} from "@/paraglide/messages";

const TOAST_MS = 5000;

interface AppToastProps {
  message: string;
  onDismiss: () => void;
  /** "success" renders the confirmation toast, "destructive" the failure one — both with an icon. */
  variant?: "default" | "success" | "destructive";
}

/** Dark bottom-right toast shared by every surface. Portaled so it stays visible —
 *  visually and to screen readers — while a drawer or modal is open. Auto-dismisses. */
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
        variant === "success" ? "bg-primary-800" : variant === "destructive" ? "bg-status-fail-dark" : "bg-black"
      )}
    >
      {variant !== "default" && <CheckCircle2 className="size-4 shrink-0 text-white" aria-hidden="true" />}
      <p className="text-sm leading-[1.4] font-medium tracking-[0.14px] text-white">{message}</p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label={m["toast.dismiss"]()}
        className="flex items-center rounded p-0.5 text-white hover:bg-white/10"
      >
        <X className="size-4" aria-hidden="true" />
      </button>
    </div>,
    document.body
  );
}
