import {CostCard} from "./cost-card";
import {PaymentPicker} from "./payment-picker";
import {ReviewSections} from "./review-sections";
import type {DeliverySpeed, LockerNode, PackageSize, PaymentChannel, RecipientDetails, SendQuote} from "@/types/send-types";
import type {SendStep} from "./use-send-flow";
import {m} from "@/paraglide/messages";

interface ReviewStepProps {
  size: PackageSize | null;
  contents: string;
  origin: LockerNode | null;
  destination: LockerNode | null;
  speed: DeliverySpeed;
  recipient: RecipientDetails;
  channel: PaymentChannel | null;
  quote: SendQuote | null;
  quoteLoading: boolean;
  onEdit: (step: SendStep) => void;
  onChannel: (channel: PaymentChannel) => void;
}

/** Step 5 — three review cards with Edit links, the cost summary, payment channel, and terms note. */
export function ReviewStep(props: ReviewStepProps) {
  return (
    <div className="flex w-full flex-col gap-6">
      <ReviewSections
        size={props.size}
        contents={props.contents}
        origin={props.origin}
        destination={props.destination}
        speed={props.speed}
        recipient={props.recipient}
        quote={props.quote}
        onEdit={props.onEdit}
      />
      <CostCard title={m["send.cost_summary"]()} quote={props.quote} loading={props.quoteLoading} />
      <PaymentPicker channel={props.channel} walletBalance={props.quote?.walletBalance ?? null} onChange={props.onChannel} />
      <p className="w-full text-[12px] font-medium leading-[1.4] tracking-[0.24px] text-grey-600">
        {m["send.terms_pre"]()}
        <span className="text-primary-500">{m["send.terms_link"]()}</span>
        {m["send.terms_post"]()}
      </p>
    </div>
  );
}
