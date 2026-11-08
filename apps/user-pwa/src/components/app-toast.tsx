import {useEffect} from "react";
import {CircleCheck, OctagonAlert} from "lucide-react";

const TOAST_MS = 4000;

interface AppToastProps {
  message: string;
  onDismiss: () => void;
  /** "success" shows the check icon, "destructive" the alert icon. */
  variant?: "success" | "destructive";
}

/** Bottom-pinned confirmation/failure pill shared across screens (address, payment, account actions). Auto-dismisses. */
export function AppToast({message, onDismiss, variant = "success"}: AppToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, TOAST_MS);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  const Icon = variant === "success" ? CircleCheck : OctagonAlert;

  return (
    <p
      role="status"
      className="fixed bottom-24 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-[12px] bg-white px-4 py-3 text-[14px] font-medium whitespace-nowrap text-foreground shadow-[0px_4px_16px_0px_rgba(0,0,0,0.12)]"
    >
      <Icon className={`size-5 shrink-0 ${variant === "success" ? "text-primary-500" : "text-status-fail"}`} aria-hidden="true" />
      {message}
    </p>
  );
}
