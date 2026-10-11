import {Button} from "@alvo/ui";
import {Link} from "@tanstack/react-router";
import {m} from "@/paraglide/messages";
import {formatNaira} from "@/lib/format-naira";
import type {CreateBatchResult} from "@/types/shipment-types";
import successCheckUrl from "@/assets/success-check.svg";

function StatBox({value, label}: {value: string; label: string}) {
  return (
    <div className="flex flex-1 flex-col items-center gap-1 rounded-lg bg-white px-4 py-3">
      <p className="text-2xl leading-[1.2] font-medium tracking-[-0.24px] text-black">{value}</p>
      <p className="text-sm leading-[1.4] tracking-[0.14px] text-grey-500">{label}</p>
    </div>
  );
}

interface ShipmentSuccessProps {
  result: CreateBatchResult;
  receiptEmail: string;
  onDownloadLabels: () => void;
  onDownloadReceipt: () => void;
  onCreateAnother: () => void;
}

/** The post-payment confirmation: check badge, batch stats card, and follow-up actions. */
export function ShipmentSuccess({result, receiptEmail, onDownloadLabels, onDownloadReceipt, onCreateAnother}: ShipmentSuccessProps) {
  return (
    <section className="mx-auto flex w-[378px] flex-col items-center gap-8 py-16">
      <div className="flex w-full flex-col items-center gap-6">
        <img src={successCheckUrl} alt="" aria-hidden="true" className="size-16" />
        <div className="flex w-full flex-col items-center gap-2 text-center">
          <h1 className="w-full text-[28px] leading-[1.2] font-bold tracking-[-0.28px] text-black">{m["success.title"]()}</h1>
          <p className="w-full text-base leading-[1.4] tracking-[0.16px] text-grey-500">{m["success.sub"]()}</p>
        </div>
        <div className="rounded-lg border border-grey-300 px-3 py-3">
          <p className="text-sm leading-[1.4] tracking-[0.14px] text-grey-600">{m["success.shipment_id"]({id: result.batchId})}</p>
        </div>
      </div>
      <div className="flex w-full flex-col gap-6 rounded-2xl bg-[#f9f9f9] p-4">
        <div className="flex w-full gap-3">
          <StatBox value={String(result.shipmentCount)} label={m["success.stat_shipments"]()} />
          <StatBox value={`₦${formatNaira(result.totalPaid)}`} label={m["success.stat_paid"]()} />
          <StatBox value={result.estimatedDelivery} label={m["success.stat_delivery"]()} />
        </div>
        <div className="flex w-full flex-col gap-2">
          <Button className="h-[50px] w-full" onClick={onDownloadLabels}>
            {m["success.download_labels"]()}
          </Button>
          <Button variant="outline" className="h-[50px] w-full" render={<Link to="/dashboard" />} nativeButton={false}>
            {m["success.go_dashboard"]()}
          </Button>
          <Button variant="transparent" className="h-[50px] w-full" onClick={onCreateAnother}>
            {m["success.create_another"]()}
          </Button>
        </div>
      </div>
      <p className="text-base leading-[1.4] tracking-[0.16px] text-grey-500">
        {m["success.receipt"]({email: receiptEmail})}{" "}
        <button type="button" onClick={onDownloadReceipt} className="font-medium text-primary-500 hover:underline">
          {m["success.download_pdf"]()}
        </button>
      </p>
    </section>
  );
}
