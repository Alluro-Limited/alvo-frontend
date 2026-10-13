import {NodePicker} from "./node-picker";
import {SendAction} from "./send-action";
import {SendBody} from "./send-body";
import {SendHeader} from "./send-header";
import type {useSendFlow} from "./use-send-flow";
import {useSendBookingMutation, useSendNodesQuery, useSendQuoteQuery} from "@/queries/use-send-queries";

type Flow = ReturnType<typeof useSendFlow>;

const STEP_INDEX = {package: 1, nodes: 2, recipient: 3, review: 4} as const;

/** The wizard shell for steps 2–5: progress header, scrollable step body, bottom action, node sheet. */
export function SendWizard({flow}: {flow: Flow}) {
  const nodes = useSendNodesQuery();
  const quote = useSendQuoteQuery(flow.quoteInput);
  const booking = useSendBookingMutation();
  const stepIndex = STEP_INDEX[flow.step as keyof typeof STEP_INDEX] ?? 1;

  return (
    <main className="relative flex h-dvh w-full flex-col bg-white">
      <div className="px-6 pt-[63px]">
        <SendHeader step={stepIndex} onBack={flow.back} />
      </div>
      <div className="flex flex-1 flex-col gap-8 overflow-y-auto px-6 pt-8 pb-4">
        <SendBody flow={flow} quote={quote.data ?? null} quoteLoading={quote.isFetching} />
      </div>
      <div className="px-6 pb-[max(24px,env(safe-area-inset-bottom))]">
        <SendAction flow={flow} quote={quote.data ?? null} busy={booking.isPending} onSubmit={() => submit(flow, booking)} />
      </div>
      <NodePicker flow={flow} nodes={nodes.data ?? []} />
    </main>
  );
}

function submit(flow: Flow, booking: ReturnType<typeof useSendBookingMutation>) {
  if (!flow.size || !flow.origin || !flow.destination || !flow.channel) return;
  booking.mutate(
    {
      service: "locker_to_locker",
      size: flow.size,
      contents: flow.contents,
      fragile: flow.fragile,
      originNodeId: flow.origin.id,
      destinationNodeId: flow.destination.id,
      favorite: flow.favorite,
      speed: flow.speed,
      recipient: flow.recipient,
      channel: flow.channel,
    },
    {
      onSuccess: (b) => {
        flow.setBooking(b);
        flow.setStep("confirmed");
      },
    }
  );
}
