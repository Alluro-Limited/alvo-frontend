import {Copy, Package, ShieldCheck} from "lucide-react";

const rows = [
  {label: "From", value: "Locker · Oshodi"},
  {label: "To", value: "Locker · Ajah"},
  {label: "Size", value: "Medium"},
];

export function StepBook() {
  return (
    <div className="w-full rounded-2xl bg-white p-5 shadow-lg">
      <div className="flex items-center gap-2">
        <span className="flex size-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
          <Package className="size-5" />
        </span>
        <h4 className="text-lg font-semibold text-black">New parcel</h4>
      </div>

      <div className="mt-4 flex flex-col gap-2 text-sm">
        {rows.map((row) => (
          <span key={row.label} className="flex justify-between rounded-lg bg-grey-100 px-3 py-2.5">
            <span className="text-grey-600">{row.label}</span>
            <span className="font-medium text-black">{row.value}</span>
          </span>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between rounded-xl border border-primary-500 bg-primary-50 px-3 py-2.5">
        <span className="flex flex-col">
          <span className="text-xs text-grey-600">Tracking code</span>
          <span className="text-base font-semibold tracking-wide text-primary-700">ALV-4821</span>
        </span>
        <Copy className="size-4 text-primary-600" />
      </div>

      <span className="mt-3 flex items-center gap-2 text-xs text-grey-600">
        <ShieldCheck className="size-4 shrink-0 text-primary-500" /> No name, number or address shared.
      </span>
    </div>
  );
}
