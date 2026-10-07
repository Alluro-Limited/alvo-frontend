import {useState} from "react";
import {usersService} from "@/services/users-service";
import type {UserExportParams} from "@/types/users-types";
import {downloadCsv} from "@/components/workloads/workloads-format";

/** CSV export: the service returns the file body, this hook downloads it. */
export function useUserExport(params: UserExportParams) {
  const [exporting, setExporting] = useState(false);

  const exportUsers = async (ids?: string[]) => {
    setExporting(true);
    try {
      downloadCsv(await usersService.exportUsers({...params, ids}));
    } finally {
      setExporting(false);
    }
  };

  return {exporting, exportUsers};
}
