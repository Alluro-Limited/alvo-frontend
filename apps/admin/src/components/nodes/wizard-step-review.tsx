import {m} from "@/paraglide/messages";
import type {WizardForm} from "./register-wizard-types";

function ReviewRow({label, value}: {label: string; value: string}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-grey-100 py-2 last:border-b-0">
      <span className="text-sm leading-[1.4] tracking-[0.14px] text-grey-500">{label}</span>
      <span className="truncate text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{value}</span>
    </div>
  );
}

/** Step 4 — read back basic info and capacity before the registration submits. */
export function WizardStepReview({form}: {form: WizardForm}) {
  return (
    <div className="flex flex-col gap-4">
      <section className="rounded-lg border border-grey-200 p-4" aria-label={m["nodes.review_basic_title"]()}>
        <h3 className="pb-2 text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{m["nodes.review_basic_title"]()}</h3>
        <ReviewRow label={m["nodes.review_name"]()} value={form.name} />
        <ReviewRow label={m["nodes.review_partner"]()} value={form.partner} />
        <ReviewRow label={m["nodes.field_region"]()} value={form.region} />
        <ReviewRow label={m["nodes.review_zone"]()} value={form.zone} />
        <ReviewRow label={m["nodes.review_address"]()} value={form.address} />
      </section>
      <section className="rounded-lg border border-grey-200 p-4" aria-label={m["nodes.review_capacity_title"]()}>
        <h3 className="pb-2 text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{m["nodes.review_capacity_title"]()}</h3>
        <ReviewRow label={m["nodes.review_small"]()} value={String(form.small)} />
        <ReviewRow label={m["nodes.review_medium"]()} value={String(form.medium)} />
        <ReviewRow label={m["nodes.review_large"]()} value={String(form.large)} />
        <ReviewRow label={m["nodes.review_dropoff"]()} value={String(form.dropoffKg)} />
      </section>
    </div>
  );
}
