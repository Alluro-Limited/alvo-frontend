import {ScanBarcode} from "lucide-react";
import {m} from "@/paraglide/messages";

interface ScanSectionProps {
  /** Last scanned code — the box swaps the placeholder for a barcode render. */
  lastScanned: string | null;
  pending: boolean;
  onScan: () => void;
}

/** The dashed scan area + the "Tap to Scan Barcode" trigger. */
export function ScanSection({lastScanned, pending, onScan}: ScanSectionProps) {
  return (
    <section>
      <div className="grid h-[120px] place-items-center rounded-[14px] border-2 border-dashed border-grey-300 bg-grey-50">
        {lastScanned ? (
          <div className="text-center">
            <div
              aria-hidden="true"
              className="mx-auto h-10 w-40 bg-[repeating-linear-gradient(90deg,#0f172a_0_2px,transparent_2px_5px,#0f172a_5px_6px,transparent_6px_9px)]"
            />
            <p className="mt-2 font-mono text-[12px] font-medium">{lastScanned}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-grey-400">
            <ScanBarcode className="size-8" strokeWidth={1.5} aria-hidden="true" />
            <p className="text-[12px] font-medium">{m["job.no_scan"]()}</p>
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={onScan}
        disabled={pending}
        className="mt-3 h-[50px] w-full rounded-[10px] bg-primary-500 text-[16px] font-semibold text-white disabled:bg-grey-300 disabled:text-grey-500"
      >
        {pending ? m["job.scanning"]() : m["job.tap_scan"]()}
      </button>
    </section>
  );
}
