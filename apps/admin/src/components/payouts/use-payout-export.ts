import {useState} from "react";
import {payoutsService} from "@/services/payouts-service";
import type {PayoutExportParams} from "@/types/payouts-types";
import {downloadCsv} from "@/components/workloads/workloads-format";

/** CSV export of the current payout table — `ids` narrows to the checked rows. */
export function usePayoutExport(params: PayoutExportParams) {
  const [exporting, setExporting] = useState(false);
  const [failed, setFailed] = useState(false);
  // `Promise.finally` instead of try/finally — React Compiler can't compile the statement form.
  const finish = () => setExporting(false);

  const exportPayouts = async (ids?: string[]) => {
    setExporting(true);
    await payoutsService
      .exportPayouts({...params, ids})
      .then(downloadCsv)
      .catch(() => setFailed(true))
      .finally(finish);
  };

  return {exporting, failed, dismissFailed: () => setFailed(false), exportPayouts};
}
