import {Link} from "@tanstack/react-router";
import batchesEmptyIconUrl from "@/assets/batches-empty-icon.png";
import {m} from "@/paraglide/messages";
import {downloadTextFile} from "@/lib/download-text-file";
import {CSV_TEMPLATE} from "@/components/batch/parse-shipments-csv";

const FEATURES = [m["batches.feat_tracking"], m["batches.feat_sms"], m["batches.feat_volume"]];

/** The empty batches state: icon, pitch, CTAs, and feature chips — centered in the content area. */
export function BatchesEmpty() {
  return (
    <div className="flex min-h-[70vh] w-full flex-col items-center justify-center gap-16">
      <div className="flex w-[389px] flex-col items-center">
        <img src={batchesEmptyIconUrl} alt="" aria-hidden="true" className="size-[72px]" />
        <div className="mt-4 flex flex-col gap-[2px] text-center">
          <h2 className="text-lg leading-[1.2] font-medium text-black">{m["batches.empty_title"]()}</h2>
          <p className="text-xs leading-[1.4] tracking-[0.12px] text-grey-500">{m["batches.empty_sub"]()}</p>
        </div>
        <div className="mt-4 flex w-[207px] flex-col gap-2">
          <Link
            to="/new-shipment"
            className="flex h-[38px] items-center justify-center rounded-lg bg-primary-500 px-4 text-base leading-[1.4] font-medium tracking-[0.32px] text-white"
          >
            {m["batches.empty_cta"]()}
          </Link>
          <button
            type="button"
            onClick={() => downloadTextFile("alvo-shipments-template.csv", CSV_TEMPLATE)}
            className="h-[38px] text-sm leading-[1.4] font-medium tracking-[0.14px] text-primary-500 underline"
          >
            {m["batches.empty_template"]()}
          </button>
        </div>
      </div>
      <div className="flex max-w-[348px] flex-wrap items-center justify-center gap-1.5">
        {FEATURES.map((feature) => (
          <span key={feature()} className="rounded bg-white px-2 py-1 text-xs leading-[1.4] tracking-[0.12px] text-primary-500">
            {feature()}
          </span>
        ))}
      </div>
    </div>
  );
}
