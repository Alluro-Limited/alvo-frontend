import {useState} from "react";
import {couriersService} from "@/services/couriers-service";
import type {CourierAssignmentsParams, CourierExportParams} from "@/types/couriers-types";
import {downloadCsv} from "@/components/workloads/workloads-format";

/** CSV exports: the couriers list and a courier's assignment history — the service returns the file body. */
export function useCourierExport(params: CourierExportParams) {
  const [exporting, setExporting] = useState(false);
  // `Promise.finally` instead of try/finally — React Compiler can't compile the statement form.
  const finish = () => setExporting(false);

  const exportCouriers = async (ids?: string[]) => {
    setExporting(true);
    await couriersService
      .exportCouriers({...params, ids})
      .then(downloadCsv)
      .finally(finish);
  };

  const exportAssignments = async (id: string, filters: Omit<CourierAssignmentsParams, "page"> & {ids?: string[]}) => {
    setExporting(true);
    await couriersService.exportCourierAssignments(id, filters).then(downloadCsv).finally(finish);
  };

  return {exporting, exportCouriers, exportAssignments};
}
