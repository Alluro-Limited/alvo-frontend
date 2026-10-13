import {ChevronLeft} from "lucide-react";
import {cn} from "cnfast";
import {m} from "@/paraglide/messages";

interface AuthHeaderProps {
  /** Omit to hide the back button (the design keeps the slot but renders it invisible). */
  onBack?: () => void;
  /** Sign-up wizard progress: which of the three bars are filled. */
  step?: 1 | 2 | 3;
}

/** Back arrow, centered "Alvo" wordmark, and the optional three-bar step indicator. */
export function AuthHeader({onBack, step}: AuthHeaderProps) {
  return (
    <header className="relative flex h-8 w-full items-center justify-center">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          aria-label={m["auth.back"]()}
          className="absolute left-0 flex size-8 items-center justify-center"
        >
          <ChevronLeft className="size-6" aria-hidden="true" />
        </button>
      ) : null}
      <span className="text-[18px] font-medium leading-[1.4] tracking-[0.18px] text-primary-500">{m["auth.brand"]()}</span>
      {step ? (
        <div className="absolute right-0 flex items-center gap-1" aria-hidden="true">
          {[1, 2, 3].map((i) => (
            <span key={i} className={cn("h-1 w-6 rounded-[1px]", i <= step ? "bg-primary-500" : "bg-grey-300")} />
          ))}
        </div>
      ) : null}
    </header>
  );
}
