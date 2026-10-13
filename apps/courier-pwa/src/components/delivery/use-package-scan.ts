import {useState} from "react";
import {HTTPError} from "ky";
import type {SimpleMessage} from "@/lib/i18n";
import {useScanNextMutation, useScanPackageMutation} from "@/queries/use-delivery-queries";

/**
 * The Packages-tab scan flow: the last scanned code (drives the barcode render)
 * and the manual-entry notice (409 → amber "already scanned", anything else → red "not found").
 */
export function usePackageScan(jobId: string) {
  const scanNext = useScanNextMutation(jobId);
  const scanCode = useScanPackageMutation(jobId);
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const [notice, setNotice] = useState<{key: SimpleMessage; tone: "warn" | "error"} | null>(null);

  const showScanned = (code: string) => {
    setLastScanned(code);
    setNotice(null);
  };

  const scanNextPackage = () =>
    scanNext.mutate(undefined, {
      onSuccess: (d) => showScanned(d.packages.filter((p) => p.scanned).at(-1)?.code ?? ""),
      onError: () => setNotice({key: "job.scan_failed", tone: "error"}),
    });

  const scanManual = (code: string) =>
    scanCode.mutate(code, {
      onSuccess: () => showScanned(code),
      onError: async (err) => {
        const status = err instanceof HTTPError ? err.response.status : 0;
        setNotice(status === 409 ? {key: "job.already_scanned", tone: "warn"} : {key: "job.not_found", tone: "error"});
      },
    });

  return {lastScanned, notice, scanning: scanNext.isPending || scanCode.isPending, scanNextPackage, scanManual};
}
