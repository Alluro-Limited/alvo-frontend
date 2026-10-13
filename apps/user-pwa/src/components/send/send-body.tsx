import {NodesStep} from "./nodes-step";
import {PackageStep} from "./package-step";
import {RecipientStep} from "./recipient-step";
import {ReviewStep} from "./review-step";
import type {useSendFlow} from "./use-send-flow";
import type {SendQuote} from "@/types/send-types";
import {m} from "@/paraglide/messages";

type Flow = ReturnType<typeof useSendFlow>;

interface SendBodyProps {
  flow: Flow;
  quote: SendQuote | null;
  quoteLoading: boolean;
}

/** Title + subtitle + step body for the four wizard screens (service step renders its own hero layout). */
export function SendBody({flow, quote, quoteLoading}: SendBodyProps) {
  const heading = STEP_HEADINGS[flow.step as keyof typeof STEP_HEADINGS] ?? STEP_HEADINGS.package;
  return (
    <>
      <div className="flex w-full flex-col gap-2">
        <h1 className="text-[24px] font-medium leading-[1.2] tracking-[-0.24px] text-foreground">{m[heading.title]()}</h1>
        <p className="text-[16px] leading-[1.4] tracking-[0.16px] text-grey-500">{m[heading.desc]()}</p>
      </div>
      {flow.step === "package" ? (
        <PackageStep
          size={flow.size}
          contents={flow.contents}
          fragile={flow.fragile}
          onSize={flow.setSize}
          onContents={flow.setContents}
          onFragile={flow.setFragile}
        />
      ) : null}
      {flow.step === "nodes" ? (
        <NodesStep
          origin={flow.origin}
          destination={flow.destination}
          favorite={flow.favorite}
          speed={flow.speed}
          quote={quote}
          quoteLoading={quoteLoading}
          onOpenPicker={flow.setPicker}
          onFavorite={flow.setFavorite}
          onSpeed={flow.setSpeed}
        />
      ) : null}
      {flow.step === "recipient" ? <RecipientStep recipient={flow.recipient} onChange={flow.setRecipient} /> : null}
      {flow.step === "review" ? (
        <ReviewStep
          size={flow.size}
          contents={flow.contents}
          origin={flow.origin}
          destination={flow.destination}
          speed={flow.speed}
          recipient={flow.recipient}
          channel={flow.channel}
          quote={quote}
          quoteLoading={quoteLoading}
          onEdit={flow.setStep}
          onChannel={flow.setChannel}
        />
      ) : null}
    </>
  );
}

const STEP_HEADINGS = {
  package: {title: "send.title", desc: "send.package_desc"},
  nodes: {title: "send.nodes_title", desc: "send.nodes_desc"},
  recipient: {title: "send.rc_title", desc: "send.rc_desc"},
  review: {title: "send.review_title", desc: "send.review_desc"},
} as const;
