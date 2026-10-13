import {useState} from "react";
import {Lock} from "lucide-react";
import {m} from "@/paraglide/messages";

interface AccessCodeCardProps {
  code: string;
}

/**
 * The teal "Locker Access Code" card on Overview: a Reveal pill swaps the masked
 * dots for the digits, and the lock pill explains what the code opens.
 */
export function AccessCodeCard({code}: AccessCodeCardProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <section className="overflow-hidden rounded-[14px] bg-primary-500">
      <div className="flex items-center justify-between px-4 pt-3.5">
        <h2 className="text-[14px] font-semibold text-white">{m["job.access_code"]()}</h2>
        <button
          type="button"
          onClick={() => setRevealed((r) => !r)}
          className="rounded-full bg-white px-4 py-1.5 text-[12px] font-semibold text-foreground"
        >
          {revealed ? m["job.hide"]() : m["job.reveal"]()}
        </button>
      </div>
      <div className="mx-3 mt-3 mb-3 rounded-[12px] bg-[#0f5a50] px-4 py-6">
        <p className="text-center font-mono text-[18px] font-semibold tracking-[0.4em] text-white">
          {revealed ? code.split("").join("  ") : "•  •  •  •  •  •"}
        </p>
        <div className="mt-5 flex justify-center">
          <p className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-[12px] font-medium text-foreground">
            <Lock className="size-4 text-primary-600" aria-hidden="true" />
            {m["job.locker_hint"]()}
          </p>
        </div>
      </div>
    </section>
  );
}
