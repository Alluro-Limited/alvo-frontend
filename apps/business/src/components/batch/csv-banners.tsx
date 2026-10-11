import {CircleCheck, OctagonAlert, TriangleAlert} from "lucide-react";
import {cn} from "cnfast";
import {m} from "@/paraglide/messages";
import type {RecipientErrorCode} from "@/components/new-shipment/recipient-draft";

const ERROR_STYLE: Record<RecipientErrorCode, {icon: typeof TriangleAlert; className: string}> = {
  locker: {icon: TriangleAlert, className: "bg-status-warning-subtle text-status-warning"},
  phone: {icon: OctagonAlert, className: "bg-status-fail-subtle text-status-fail"},
  name: {icon: OctagonAlert, className: "bg-status-fail-subtle text-status-fail"},
};

export function rowErrorMessage(code: RecipientErrorCode, row: number | undefined, detail?: string) {
  if (code === "locker") return m["wiz.err_locker"]({row: row ?? 0, id: detail ?? ""});
  if (code === "phone") return m["wiz.err_phone"]({row: row ?? 0});
  return m["wiz.err_name"]({row: row ?? 0});
}

interface CsvBannersProps {
  validCount: number;
  totalCount: number;
  errors: {id: string; row: number | undefined; code: RecipientErrorCode; detail?: string}[];
}

/** Post-upload validation feedback: one green summary banner plus a banner per bad row. */
export function CsvBanners({validCount, totalCount, errors}: CsvBannersProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-center gap-2 rounded-lg bg-success-50 px-3 py-2.5">
        <CircleCheck className="size-4 shrink-0 text-success-500" aria-hidden="true" />
        <p className="text-xs leading-[1.4] font-medium tracking-[0.12px] text-success-600">
          {m["wiz.csv_ok"]({ok: validCount, total: totalCount})}
        </p>
      </div>
      {errors.map((error) => {
        const style = ERROR_STYLE[error.code];
        const Icon = style.icon;
        return (
          <div key={error.id} className={cn("flex items-center gap-2 rounded-lg px-3 py-2.5", style.className)}>
            <Icon className="size-4 shrink-0" aria-hidden="true" />
            <p className="text-xs leading-[1.4] font-medium tracking-[0.12px]">{rowErrorMessage(error.code, error.row, error.detail)}</p>
          </div>
        );
      })}
    </div>
  );
}
