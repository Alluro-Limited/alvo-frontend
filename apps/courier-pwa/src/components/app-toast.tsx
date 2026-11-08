import {useEffect} from "react";
import {CircleCheck, OctagonAlert} from "lucide-react";

const TOAST_MS = 4000;

interface AppToastProps {
  message: string;
  onDismiss: () => void;
  /** "success" shows the check icon, "destructive" the alert icon. */
  variant?: "success" | "destructive";
}

/** Bottom-pinned confirmation/failure pill shared across screens (area change, job actions, settings saves). Auto-dismisses. */
export function AppToast({message, onDismiss, variant = "success"}: AppToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, TOAST_MS);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  const Icon = variant === "success" ? CircleCheck : OctagonAlert;

  return (
    <p
      role="status"
      className="fixed bottom-24 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white px-4 py-2.5 text-[13px] font-medium whitespace-nowrap shadow-lg"
    >
      <Icon className={`size-4 shrink-0 ${variant === "success" ? "text-success-500" : "text-status-fail"}`} aria-hidden="true" />
      {message}
    </p>
  );
}
