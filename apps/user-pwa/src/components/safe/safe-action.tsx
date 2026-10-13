import {Button} from "@alvo/ui";
import type {useSafeFlow, SafeStep} from "./use-safe-flow";
import type {SafeQuote} from "@/types/safe-types";
import {naira} from "@/lib/money";
import {m} from "@/paraglide/messages";

type Flow = ReturnType<typeof useSafeFlow>;

const NEXT: Partial<Record<SafeStep, SafeStep>> = {
  node: "options",
  options: "review",
};

function isStepEnabled(flow: Flow): boolean {
  if (flow.step === "node") return flow.nodeReady;
  if (flow.step === "options") return flow.optionsReady;
  return true;
}

/** The bottom wizard button — Continue on the early steps, Pay & Reserve on review. */
export function SafeAction({flow, quote, busy, onSubmit}: {flow: Flow; quote: SafeQuote | null; busy: boolean; onSubmit: () => void}) {
  if (flow.step === "review") {
    return (
      <Button
        className="w-full text-[16px] font-medium"
        variant={flow.channel ? "default" : "disabled"}
        isLoading={busy}
        onClick={onSubmit}
      >
        {busy ? m["safe.reserving"]() : m["safe.pay_reserve"]({total: naira(quote?.total ?? 0)})}
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
