import {useState} from "react";
import {payoutsService} from "@/services/payouts-service";
import type {PayoutExportParams} from "@/types/payouts-types";
import {downloadCsv} from "@/components/workloads/workloads-format";

/** CSV export of the current payout table — `ids` narrows to the checked rows. */
export function usePayoutExport(params: PayoutExportParams) {
  const [exporting, setExporting] = useState(false);
  // `Promise.finally` instead of try/finally — React Compiler can't compile the statement form.
  const finish = () => setExporting(false);

  const exportPayouts = async (ids?: string[]) => {
    setExporting(true);
    await payoutsService
      .exportPayouts({...params, ids})
      .then(downloadCsv)
      .finally(finish);
  };

  return {exporting, exportPayouts};
}
