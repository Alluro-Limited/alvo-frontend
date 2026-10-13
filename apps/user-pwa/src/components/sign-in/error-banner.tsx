import {X} from "lucide-react";
import {m} from "@/paraglide/messages";

/** The red "Wrong Password" banner shown above the button when sign-in returns 401. */
export function ErrorBanner({onClose}: {onClose: () => void}) {
  return (
    <div className="flex w-full items-start gap-2 rounded-[8px] border border-status-fail bg-[#fef2f1] px-4 py-3" role="alert">
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-[14px] font-medium leading-[1.4] tracking-[0.14px] text-status-fail">{m["si.err_title"]()}</span>
        <span className="text-[13px] leading-[1.4] tracking-[0.13px] text-status-fail/80">{m["si.err_desc"]()}</span>
      </div>
      <button
        type="button"
        aria-label={m["si.err_close"]()}
        onClick={onClose}
        className="flex size-5 shrink-0 items-center justify-center text-status-fail"
      >
        <X className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}
