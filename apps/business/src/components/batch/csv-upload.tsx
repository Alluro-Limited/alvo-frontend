import {Download, FileSpreadsheet, Trash2} from "lucide-react";
import {m} from "@/paraglide/messages";
import {downloadTextFile} from "@/lib/download-text-file";
import type {useBatchWizard} from "./use-batch-wizard";
import {CsvBanners} from "./csv-banners";
import {DropZone} from "./drop-zone";
import {CSV_TEMPLATE} from "./parse-shipments-csv";

function TemplateRow() {
  return (
    <div className="flex w-full items-center justify-between">
      <button
        type="button"
        onClick={() => downloadTextFile("alvo-shipments-template.csv", CSV_TEMPLATE)}
        className="flex items-center gap-1 text-xs leading-[1.4] font-medium tracking-[0.12px] text-primary-500 hover:underline"
      >
        <Download className="size-4" aria-hidden="true" />
        {m["wiz.template"]()}
      </button>
      <p className="text-xs leading-[1.4] tracking-[0.12px] text-grey-500">{m["wiz.required"]()}</p>
    </div>
  );
}

function FileChip({file, onRemove}: {file: {name: string; sizeKb: number}; onRemove: () => void}) {
  return (
    <div className="flex w-full items-center gap-3">
      <span className="flex size-10 items-center justify-center rounded-lg bg-success-50">
        <FileSpreadsheet className="size-5 text-success-600" aria-hidden="true" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{file.name}</span>
        <span className="text-xs leading-[1.4] tracking-[0.12px] text-grey-500">
          {m["wiz.upload_complete"]()} • {file.sizeKb}kb
        </span>
      </span>
      <button type="button" onClick={onRemove} aria-label={m["wiz.remove_file"]()} className="text-status-fail hover:text-status-fail/70">
        <Trash2 className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}

/** The "Upload CSV" tab: template link, dropzone, uploaded-file chip, and row-error banners. */
export function CsvUpload({wizard}: {wizard: ReturnType<typeof useBatchWizard>}) {
  const {recipients} = wizard;
  const csvErrors = recipients.errors.filter((error) => error.recipient.csvRow !== undefined);
  const csvRows = recipients.recipients.filter((recipient) => recipient.csvRow !== undefined);

  return (
    <div className="flex w-full flex-col gap-4">
      <TemplateRow />
      <DropZone onFile={recipients.uploadFile} />
      {recipients.csvFile && <FileChip file={recipients.csvFile} onRemove={recipients.removeFile} />}
      {recipients.csvFile?.parseError === "empty" && <p className="text-xs text-status-fail">{m["wiz.err_empty"]()}</p>}
      {recipients.csvFile?.parseError === "header" && <p className="text-xs text-status-fail">{m["wiz.err_header"]()}</p>}
      {csvRows.length > 0 && (
        <CsvBanners
          validCount={csvRows.length - csvErrors.length}
          totalCount={csvRows.length}
          errors={csvErrors.map((error) => ({
            id: error.recipient.id,
            row: error.recipient.csvRow,
            code: error.error.code,
            detail: error.error.detail,
          }))}
        />
      )}
    </div>
  );
}
