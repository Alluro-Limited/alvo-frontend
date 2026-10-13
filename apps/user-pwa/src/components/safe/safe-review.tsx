import {Lock} from "lucide-react";
import {CostCard} from "@/components/send/cost-card";
import {PaymentPicker} from "@/components/send/payment-picker";
import {SafeSummary} from "./safe-summary";
import type {SafeDuration, SafeNode, SafeQuote, SafeSizeOption} from "@/types/safe-types";
import type {PaymentChannel} from "@/types/send-types";
import {m} from "@/paraglide/messages";

interface SafeReviewProps {
  node: SafeNode;
  size: SafeSizeOption | undefined;
  duration: SafeDuration | undefined;
  storing: string;
  quote: SafeQuote | null;
  quoteLoading: boolean;
  channel: PaymentChannel | null;
  onChannel: (channel: PaymentChannel) => void;
  onEdit: () => void;
}

/** Step 3 "Review & Pay" — storage summary, cost breakdown, payment channel, and the terms note. */
export function SafeReview({node, size, duration, storing, quote, quoteLoading, channel, onChannel, onEdit}: SafeReviewProps) {
  return (
    <div className="flex w-full flex-col gap-6">
      <SafeSummary node={node} size={size} duration={duration} storing={storing} onEdit={onEdit} />
      <CostCard title={m["safe.cost_title"]()} quote={quote} loading={quoteLoading} />
      <PaymentPicker channel={channel} walletBalance={quote?.walletBalance ?? null} onChange={onChannel} />
      <span className="flex items-center justify-center gap-1 text-[10px] leading-[1.4] tracking-[0.1px] text-grey-500">
        <Lock className="size-3.5" aria-hidden="true" />
        {m["safe.secure_note"]()}
      </span>
      <p className="text-[12px] leading-[1.4] tracking-[0.12px] text-grey-500">
        {m["send.terms_pre"]()}
        <span className="font-medium text-primary-500">{m["send.terms_link"]()}</span>
        {m["send.terms_post"]()}
      </p>
    </div>
  );
}
