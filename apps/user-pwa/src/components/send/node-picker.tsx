import {NodeSheet} from "./node-sheet";
import type {useSendFlow} from "./use-send-flow";
import type {LockerNode} from "@/types/send-types";

type Flow = ReturnType<typeof useSendFlow>;

/** Wires the Select Locker sheet to the wizard's picker state (role, exclusions, favorite). */
export function NodePicker({flow, nodes}: {flow: Flow; nodes: LockerNode[]}) {
  const excludeId = flow.picker === "origin" ? (flow.destination?.id ?? null) : (flow.origin?.id ?? null);
  return (
    <NodeSheet
      open={flow.picker !== null}
      nodes={nodes}
      excludeId={excludeId}
      favoriteId={flow.favorite ? (flow.origin?.id ?? null) : null}
      onClose={() => flow.setPicker(null)}
      onPick={flow.pickNode}
    />
  );
}
