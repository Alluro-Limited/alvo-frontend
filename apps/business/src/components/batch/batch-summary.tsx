import {m} from "@/paraglide/messages";
import {formatNaira} from "@/lib/format-naira";
import {lockerName, type RecipientDraft} from "@/components/new-shipment/recipient-draft";
import type {useBatchWizard} from "./use-batch-wizard";
import {SummaryBlock, SummaryRow} from "./summary-block";

type Wizard = ReturnType<typeof useBatchWizard>;

const NEXT_STEPS = [m["wiz.next_1"], m["wiz.next_2"], m["wiz.next_3"], m["wiz.next_4"]];

function countSize(recipients: RecipientDraft[], size: string) {
  return recipients.filter((recipient) => recipient.size === size).length;
}

/** Steps 2–3 right panel: batch metadata, size mix, and the running cost estimate. */
export function BatchSummary({wizard}: {wizard: Wizard}) {
  const {recipients: data, details, lockers} = wizard;
  const {recipients, cost} = data;
  const sizeRows: [string, number][] = [
    [m["wiz.size_s"](), countSize(recipients, "S")],
    [m["wiz.size_m"](), countSize(recipients, "M")],
    [m["wiz.size_l"](), countSize(recipients, "B")],
  ];

  return (
    <div className="flex w-full flex-col gap-5 rounded-lg border border-grey-300 bg-white p-6">
      <p className="text-base leading-[1.4] font-medium tracking-[0.16px] text-black">{m["wiz.summary"]()}</p>
      <SummaryBlock>
        <SummaryRow label={m["wiz.sum_name"]()} value={details.name.trim() || "—"} />
        <SummaryRow label={m["wiz.sum_origin"]()} value={lockerName(lockers, details.origin) || "—"} />
        <SummaryRow label={m["wiz.sum_total"]()} value={String(recipients.length)} />
        <SummaryRow label={m["wiz.standard"]()} value={String(cost.standardCount)} />
        <SummaryRow label={m["wiz.express"]()} value={String(cost.expressCount)} />
      </SummaryBlock>
      <SummaryBlock title={m["wiz.sizes"]()}>
        {sizeRows.map(([label, count]) => (
          <SummaryRow key={label} label={label} value={String(count)} />
        ))}
      </SummaryBlock>
      <SummaryBlock title={m["wiz.est"]()}>
        <SummaryRow label={m["wiz.est_standard"]({n: cost.standardCount})} value={`₦${formatNaira(cost.standardCost)}`} />
        <SummaryRow label={m["wiz.est_express"]({n: cost.expressCount})} value={`₦${formatNaira(cost.expressCost)}`} />
        <SummaryRow label={m["wiz.total"]()} value={`₦${formatNaira(cost.subtotal)}`} />
      </SummaryBlock>
    </div>
  );
}

/** Step-4 right panel: order totals plus the "What happens next" explainer. */
export function OrderSummary({wizard}: {wizard: Wizard}) {
  const {recipients: data, details, lockers} = wizard;
  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex w-full flex-col gap-5 rounded-lg border border-grey-300 bg-white p-6">
        <p className="text-base leading-[1.4] font-medium tracking-[0.16px] text-black">{m["wiz.order"]()}</p>
        <SummaryBlock>
          <SummaryRow label={m["wiz.sum_name"]()} value={details.name.trim() || "—"} />
          <SummaryRow label={m["wiz.sum_origin"]()} value={lockerName(lockers, details.origin) || "—"} />
          <SummaryRow label={m["wiz.sum_total"]()} value={String(data.recipients.length)} />
          <SummaryRow label={m["wiz.sum_excluded"]()} value={String(data.errors.length)} />
          <SummaryRow label={m["wiz.subtotal_label"]()} value={`₦${formatNaira(data.cost.subtotal)}`} />
          <SummaryRow label={m["wiz.total"]()} value={`₦${formatNaira(data.cost.total)}`} />
        </SummaryBlock>
      </div>
      <div className="flex w-full flex-col gap-2 rounded-lg bg-[#f9f9f9] p-4">
        <p className="text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{m["wiz.next_happens"]()}</p>
        {NEXT_STEPS.map((item, index) => (
          <p key={item()} className="text-xs leading-[1.4] tracking-[0.12px] text-grey-600">{`${index + 1}. ${item()}`}</p>
        ))}
      </div>
    </div>
  );
}
