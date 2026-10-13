import {Link} from "@tanstack/react-router";
import {PackageOpen} from "lucide-react";
import type {SimpleMessage} from "@/lib/i18n";
import type {DeliveryDetail} from "@/types/delivery-types";
import {m} from "@/paraglide/messages";
import {ManualEntry} from "./manual-entry";
import {PackageRow} from "./package-row";
import {ScanSection} from "./scan-section";

interface PackagesTabProps {
  delivery: DeliveryDetail;
  lastScanned: string | null;
  notice: {key: SimpleMessage; tone: "warn" | "error"} | null;
  scanning: boolean;
  onScanNext: () => void;
  onScanCode: (code: string) => void;
}

/** Scan box + manual entry + a preview of the scanned packages ("See all" → full list page). */
export function PackagesTab({delivery, lastScanned, notice, scanning, onScanNext, onScanCode}: PackagesTabProps) {
  const scanned = delivery.packages.filter((p) => p.scanned);

  return (
    <div className="mt-5">
      <ScanSection lastScanned={lastScanned} pending={scanning} onScan={onScanNext} />
      <ManualEntry notice={notice} pending={scanning} onSubmit={onScanCode} />
      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-[15px] font-semibold">{`${m["job.package_list"]()} (${scanned.length})`}</h2>
        <Link to="/deliveries/$jobId/packages" params={{jobId: delivery.id}} className="text-[13px] font-semibold text-primary-500">
          {m["job.see_all"]()}
        </Link>
      </div>
      {scanned.length === 0 ? (
        <div className="mt-4 flex flex-col items-center rounded-[14px] border border-grey-200 py-8 text-grey-400">
          <PackageOpen className="size-8" strokeWidth={1.5} aria-hidden="true" />
          <p className="mt-2 text-[13px] font-medium text-grey-500">{m["job.no_packages"]()}</p>
        </div>
      ) : (
        <ul className="mt-2">
          {scanned.slice(0, 4).map((p) => (
            <PackageRow key={p.code} pkg={p} />
          ))}
        </ul>
      )}
    </div>
  );
}
