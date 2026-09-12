import {Clock, KeyRound} from "lucide-react";

export function StepCollect() {
  return (
    <div className="w-full rounded-2xl bg-white p-5 text-center shadow-lg">
      <span className="mx-auto flex size-11 items-center justify-center rounded-full bg-primary-50 text-primary-600">
        <KeyRound className="size-5" />
      </span>
      <h4 className="mt-3 text-lg font-semibold text-black">Ready for pickup</h4>
      <p className="mt-1 text-sm text-grey-600">Locker 32 · Ajah</p>

      <div className="mt-4 rounded-xl border border-dashed border-primary-500 bg-primary-50 py-3">
        <p className="text-xs text-grey-600">Access code</p>
        <p className="text-2xl font-bold tracking-[0.2em] text-primary-700">B-1247</p>
      </div>

      <span className="mt-3 flex items-center justify-center gap-2 text-xs text-grey-600">
        <Clock className="size-4 text-primary-500" /> Collect any time, 24/7
      </span>
    </div>
  );
}
