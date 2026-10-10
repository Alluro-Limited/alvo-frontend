import {useState} from "react";
import {smesService} from "@/services/smes-service";
import type {SmeExportParams} from "@/types/smes-types";
import {downloadCsv} from "@/components/workloads/workloads-format";

/** CSV export: the service returns the file body, this hook downloads it. */
export function useSmeExport(params: SmeExportParams) {
  const [exporting, setExporting] = useState(false);

  const exportSmes = async (ids?: string[]) => {
    setExporting(true);
    try {
      downloadCsv(await smesService.exportSmes({...params, ids}));
    } finally {
      setExporting(false);
    }
  };

  return {exporting, exportSmes};
}
