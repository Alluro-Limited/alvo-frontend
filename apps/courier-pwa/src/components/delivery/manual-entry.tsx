import {useState} from "react";
import {AlertCircle, CornerDownLeft, TriangleAlert} from "lucide-react";
import type {SimpleMessage} from "@/lib/i18n";
import {m} from "@/paraglide/messages";
import {cn} from "cnfast";

interface ManualEntryProps {
  /** i18n key for the notice strip, plus whether it is a warning (409) or error (404). */
  notice: {key: SimpleMessage; tone: "warn" | "error"} | null;
  pending: boolean;
  onSubmit: (code: string) => void;
}

/** Manual barcode fallback: code field + submit; 409 shows amber, 404 shows red. */
export function ManualEntry({notice, pending, onSubmit}: ManualEntryProps) {
  const [code, setCode] = useState("");

  const submit = () => {
    if (!code.trim()) return;
    onSubmit(code.trim());
    setCode("");
  };

  return (
    <section className="mt-5">
      <p className="text-[13px] font-semibold">{m["job.manual_entry"]()}</p>
      <div className="mt-2 flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={m["job.code_placeholder"]()}
          aria-label={m["job.code_placeholder"]()}
          className="h-[50px] min-w-0 flex-1 rounded-[10px] border border-grey-300 px-4 font-mono text-[14px] outline-none placeholder:text-grey-400 focus:border-primary-500"
        />
        <button
          type="button"
          onClick={submit}
          disabled={pending || !code.trim()}
          aria-label={m["job.submit_code"]()}
          className="grid size-[50px] shrink-0 place-items-center rounded-[10px] bg-primary-500 text-white disabled:bg-grey-300"
        >
          <CornerDownLeft className="size-5" aria-hidden="true" />
        </button>
      </div>
      {notice && (
        <p
          className={cn(
            "mt-3 flex items-center gap-2 rounded-[10px] px-3 py-2.5 text-[12px] font-medium",
            notice.tone === "warn" ? "bg-[#fdf4e5] text-[#b07a1a]" : "bg-danger-50 text-danger-600"
          )}
        >
          {notice.tone === "warn" ? (
            <TriangleAlert className="size-4 shrink-0" aria-hidden="true" />
          ) : (
            <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
          )}
          {m[notice.key]()}
        </p>
      )}
    </section>
  );
}
