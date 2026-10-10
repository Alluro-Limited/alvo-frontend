import {useState} from "react";
import {workloadsService} from "@/services/workloads-service";
import type {WorkloadListParams} from "@/types/workloads-types";
import {downloadCsv} from "./workloads-format";

/** CSV export: the service returns the file body, this hook downloads it. */
export function useParcelExport(params: WorkloadListParams & {batchId?: string}) {
  const [exporting, setExporting] = useState(false);

  const exportParcels = async (ids?: string[]) => {
    setExporting(true);
    try {
      downloadCsv(await workloadsService.exportList({...params, ids}));
    } finally {
      setExporting(false);
    }
  };

  return {exporting, exportParcels};
}
