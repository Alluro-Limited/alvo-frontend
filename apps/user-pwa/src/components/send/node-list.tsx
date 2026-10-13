import type {LockerNode} from "@/types/send-types";
import {m} from "@/paraglide/messages";
import pinFillUrl from "@/assets/icon-pin-fill.svg";

interface NodeListProps {
  nodes: LockerNode[];
  onPick: (node: LockerNode) => void;
}

/** The scrollable pin-icon row list inside the Select Locker sheet. */
export function NodeList({nodes, onPick}: NodeListProps) {
  if (nodes.length === 0) {
    return <p className="py-8 text-center text-[14px] text-grey-500">{m["send.no_nodes"]()}</p>;
  }
  return (
    <>
      {nodes.map((node) => (
        <button
          key={node.id}
          type="button"
          onClick={() => onPick(node)}
          aria-label={node.name}
          className="flex w-full items-center gap-2 border-b-[0.5px] border-grey-400 px-2 py-4 text-left"
        >
          <img src={pinFillUrl} alt="" aria-hidden="true" className="size-5 shrink-0" />
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="flex items-center gap-2">
              <span className="text-[14px] font-medium leading-[1.4] tracking-[0.14px] text-primary-600">{node.name}</span>
              {node.status === "offline" ? (
                <span className="text-[12px] leading-[1.4] tracking-[0.12px] text-status-fail-dark">{m["send.offline"]()}</span>
              ) : null}
            </span>
            <span className="text-[12px] leading-[1.4] tracking-[0.12px] text-grey-500">{node.address}</span>
          </span>
        </button>
      ))}
    </>
  );
}
