import {useSafeNodesQuery, useSafeOptionsQuery, useSafeQuoteQuery, useSafeReserveMutation} from "@/queries/use-safe-queries";
import {GatewaySheet} from "./gateway-sheet";
import {NodeSheet} from "@/components/send/node-sheet";
import {SafeAction} from "./safe-action";
import {SafeBody} from "./safe-body";
import {SendHeader} from "@/components/send/send-header";
import type {useSafeFlow} from "./use-safe-flow";
import type {SafeNode} from "@/types/safe-types";

type Flow = ReturnType<typeof useSafeFlow>;

const PROGRESS: Record<string, number> = {node: 1, options: 2, review: 3};

/** The Safe Storage wizard shell — header, step body, bottom action, the node sheet, and the gateway sheet. */
export function SafeWizard({flow}: {flow: Flow}) {
  const nodes = useSafeNodesQuery();
  const options = useSafeOptionsQuery();
  const quote = useSafeQuoteQuery(flow.quoteInput);
  const reserve = useSafeReserveMutation();

  const submit = () => {
    if (!flow.node || !flow.size || !flow.durationId || !flow.channel) return;
    if (flow.channel === "online") flow.setGatewayOpen(true);
    reserve.mutate(
      {nodeId: flow.node.id, size: flow.size, durationId: flow.durationId, storing: flow.storing, channel: flow.channel},
      {
        onSuccess: (reservation) => {
          flow.setGatewayOpen(false);
          flow.setReservation(reservation);
          flow.setStep("reserved");
        },
        onError: () => flow.setGatewayOpen(false),
      }
    );
  };

  return (
    <main className="relative flex h-dvh w-full flex-col bg-white">
      <div className="flex w-full flex-col px-6 pt-[65px]">
        <SendHeader step={PROGRESS[flow.step]} segments={3} onBack={flow.back} />
      </div>
      <SafeBody flow={flow} options={options.data} quote={quote.data ?? null} quoteLoading={quote.isFetching} />
      <div className="px-6 pb-[max(24px,env(safe-area-inset-bottom))] pt-4">
        <SafeAction flow={flow} quote={quote.data ?? null} busy={reserve.isPending} onSubmit={submit} />
      </div>
      <NodeSheet
        open={flow.pickerOpen}
        nodes={nodes.data ?? []}
        excludeId={null}
        favoriteId={null}
        onClose={() => flow.setPickerOpen(false)}
        onPick={(node) => flow.pickNode(node as SafeNode)}
      />
      <GatewaySheet open={flow.gatewayOpen} onClose={() => flow.setGatewayOpen(false)} />
    </main>
  );
}
