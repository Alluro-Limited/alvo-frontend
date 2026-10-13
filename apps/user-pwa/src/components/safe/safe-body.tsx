import {SafeNodeField} from "./safe-node-field";
import {SafeOptionsStep} from "./safe-options-step";
import {SafeReview} from "./safe-review";
import type {useSafeFlow, SafeStep} from "./use-safe-flow";
import type {SafeOptions, SafeQuote} from "@/types/safe-types";
import type {SimpleMessage} from "@/lib/i18n";
import {m} from "@/paraglide/messages";

type Flow = ReturnType<typeof useSafeFlow>;

const HEADINGS: Record<SafeStep, {title: SimpleMessage; desc: SimpleMessage}> = {
  node: {title: "safe.title", desc: "safe.desc"},
  options: {title: "safe.find", desc: "safe.find_desc"},
  review: {title: "safe.review_title", desc: "safe.find_desc"},
  reserved: {title: "safe.title", desc: "safe.desc"},
  code: {title: "safe.title", desc: "safe.desc"},
};

interface SafeBodyProps {
  flow: Flow;
  options: SafeOptions | undefined;
  quote: SafeQuote | null;
  quoteLoading: boolean;
}

/** The wizard's step body — heading + the node/options/review content for the current step. */
export function SafeBody({flow, options, quote, quoteLoading}: SafeBodyProps) {
  const heading = HEADINGS[flow.step];
  return (
    <div className="flex flex-1 flex-col gap-8 overflow-y-auto px-6 pt-8 pb-4">
      <div className="flex w-full flex-col gap-2">
        <h1 className="text-[24px] font-medium leading-[1.2] tracking-[-0.24px] text-foreground">{m[heading.title]()}</h1>
        <p className="text-[16px] leading-[1.4] tracking-[0.16px] text-grey-500">{m[heading.desc]()}</p>
      </div>
      {flow.step === "node" ? (
        <SafeNodeField node={flow.node} onOpen={() => flow.setPickerOpen(true)} onAlternatives={() => flow.setPickerOpen(true)} />
      ) : null}
      {flow.step === "options" && options ? (
        <SafeOptionsStep
          sizes={options.sizes}
          durations={options.durations}
          size={flow.size}
          durationId={flow.durationId}
          storing={flow.storing}
          onSize={flow.setSize}
          onDuration={flow.setDurationId}
          onStoring={flow.setStoring}
        />
      ) : null}
      {flow.step === "review" && flow.node ? (
        <SafeReview
          node={flow.node}
          size={options?.sizes.find((s) => s.id === flow.size)}
          duration={options?.durations.find((d) => d.id === flow.durationId)}
          storing={flow.storing}
          quote={quote}
          quoteLoading={quoteLoading}
          channel={flow.channel}
          onChannel={flow.setChannel}
          onEdit={() => flow.setStep("options")}
        />
      ) : null}
    </div>
  );
}
