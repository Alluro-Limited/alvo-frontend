import {Button} from "@alvo/ui";
import {isRecipientValid} from "./recipient-step";
import type {useSendFlow, SendStep} from "./use-send-flow";
import type {SendQuote} from "@/types/send-types";
import {naira} from "@/lib/money";
import {m} from "@/paraglide/messages";

type Flow = ReturnType<typeof useSendFlow>;

const NEXT: Partial<Record<SendStep, SendStep>> = {
  service: "package",
  package: "nodes",
  nodes: "recipient",
  recipient: "review",
};

function isStepEnabled(flow: Flow): boolean {
  if (flow.step === "service") return true;
  if (flow.step === "package") return flow.size !== null;
  if (flow.step === "nodes") return flow.nodesReady;
  return isRecipientValid(flow.recipient);
}

/** Bottom-pinned Continue / Pay & Confirm button with per-step enablement. */
export function SendAction({flow, quote, busy, onSubmit}: {flow: Flow; quote: SendQuote | null; busy: boolean; onSubmit: () => void}) {
  if (flow.step === "review") {
    return (
      <Button
        className="w-full text-[16px] font-medium"
        variant={flow.channel ? "default" : "disabled"}
        isLoading={busy}
        onClick={onSubmit}
      >
        {busy ? m["send.confirming"]() : m["send.pay_confirm"]({total: naira(quote?.total ?? 0)})}
      </Button>
    );
  }
  const next = NEXT[flow.step];
  return (
    <Button
      className="w-full text-[16px] font-medium"
      variant={isStepEnabled(flow) ? "default" : "disabled"}
      onClick={() => next && flow.setStep(next)}
    >
      {m["send.continue"]()}
    </Button>
  );
}
