import {Bell, ChevronDown} from "lucide-react";
import {cn} from "cnfast";
import type {LockerNode} from "@/types/send-types";
import {m} from "@/paraglide/messages";

interface NodeFieldProps {
  label: string;
  placeholder: string;
  node: LockerNode | null;
  onOpen: () => void;
  onAlternative: () => void;
}

/** Node picker input — empty state is a dropdown-style box; picked nodes expand into a detail card. */
export function NodeField({label, placeholder, node, onOpen, onAlternative}: NodeFieldProps) {
  const offline = node?.status === "offline";
  return (
    <div className="flex w-full flex-col">
      <p className="mb-2 text-[16px] leading-[1.4] tracking-[0.16px] text-primary-800">{label}</p>
      <button
        type="button"
        onClick={onOpen}
        className={cn(
          "flex w-full items-center gap-2 overflow-clip rounded-[8px] border-[0.75px] px-4 py-3.5 text-left",
          node
            ? offline
              ? "border-status-fail"
              : "border-primary-500 bg-cream shadow-[0px_2px_8px_0px_rgba(74,133,228,0.15)]"
            : "border-grey-300"
        )}
      >
        <span
          className={cn(
            "flex-1 text-[14px] leading-[1.4] tracking-[0.14px]",
            node ? (offline ? "text-status-fail" : "text-foreground") : "text-grey-500"
          )}
        >
          {node ? node.name : placeholder}
        </span>
        <ChevronDown className="size-5 text-grey-500" aria-hidden="true" />
      </button>
      {node ? <NodeCard node={node} onAlternative={onAlternative} /> : null}
    </div>
  );
}

function NodeCard({node, onAlternative}: {node: LockerNode; onAlternative: () => void}) {
  const offline = node.status === "offline";
  return (
    <div className={cn("flex w-full flex-col overflow-clip bg-[#f9f9f9] p-4", offline ? "gap-4 rounded-[12px]" : "rounded-b-[12px]")}>
      <div className="flex w-full flex-col gap-1">
        <div className="flex w-full items-center justify-between">
          <p className="text-[14px] font-medium leading-[1.4] tracking-[0.14px] text-foreground">{node.name}</p>
          {offline ? (
            <span className="flex items-center gap-1">
              <span aria-hidden="true" className="size-2 rounded-[20px] bg-status-fail" />
              <span className="text-[12px] leading-[1.4] tracking-[0.12px] text-status-fail-dark">{m["send.offline"]()}</span>
            </span>
          ) : null}
        </div>
        <p className="text-[12px] leading-[1.4] tracking-[0.12px] text-grey-500">{`${node.distance} • ${node.floor}`}</p>
        <p className="text-[12px] leading-[1.4] tracking-[0.12px] text-grey-500">{node.access}</p>
        {offline ? null : (
          <span className="flex items-center gap-1">
            <span aria-hidden="true" className="size-2 rounded-[20px] bg-success-400" />
            <span className="text-[12px] leading-[1.4] tracking-[0.12px] text-success-600">{m["send.available"]({sizes: node.sizes})}</span>
          </span>
        )}
      </div>
      {offline ? (
        <div className="flex w-full gap-2.5">
          <button
            type="button"
            className="flex h-[50px] flex-1 items-center justify-center gap-2 rounded-[8px] bg-[#f2f2f2] px-5 text-[14px] font-medium leading-[1.4] tracking-[0.28px] text-primary-500"
          >
            <Bell className="size-[22px]" aria-hidden="true" />
            {m["send.notify"]()}
          </button>
          <button
            type="button"
            onClick={onAlternative}
            className="flex h-[50px] flex-1 items-center justify-center rounded-[8px] bg-primary-500 px-5 text-[14px] font-medium leading-[1.4] tracking-[0.28px] text-white"
          >
            {m["send.view_alt"]()}
          </button>
        </div>
      ) : null}
    </div>
  );
}
