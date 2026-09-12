import {Check} from "lucide-react";

export function StepDrop() {
  return (
    <div className="w-full rounded-2xl bg-white p-5 text-center shadow-lg">
      <h4 className="text-lg font-semibold text-black">Scan to drop off</h4>
      <p className="mt-1 text-sm text-grey-600">Hold the code up at your nearest smart locker</p>

      <span className="mx-auto mt-4 flex size-40 items-center justify-center rounded-2xl bg-grey-100 p-4">
        <img src="/landing/hero/qr.svg" alt="" className="size-full" />
      </span>

      <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-primary-50 py-2.5 text-sm font-medium text-primary-700">
        <Check className="size-4" /> Compartment 24 is open
      </div>
    </div>
  );
}
