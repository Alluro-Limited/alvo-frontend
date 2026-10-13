import {Bell, ChevronDown} from "lucide-react";
import {Button} from "@alvo/ui";
import {cn} from "cnfast";
import type {SafeNode} from "@/types/safe-types";
import {m} from "@/paraglide/messages";

interface SafeNodeFieldProps {
  node: SafeNode | null;
  onOpen: () => void;
  onAlternatives: () => void;
}

/** "Select Node" input — a dropdown-style box that expands into the node's availability card once picked. */
export function SafeNodeField({node, onOpen, onAlternatives}: SafeNodeFieldProps) {
  const full = node !== null && node.safes === 0;
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex w-full flex-col">
        <p className="mb-2 text-[16px] leading-[1.4] tracking-[0.16px] text-primary-800">{m["safe.select_node"]()}</p>
        <button
          type="button"
          onClick={onOpen}
          className={cn(
            "flex w-full items-center gap-2 overflow-clip rounded-[8px] border-[0.75px] px-4 py-3.5 text-left",
            node ? "border-primary-500 bg-cream shadow-[0px_2px_8px_0px_rgba(74,133,228,0.15)]" : "border-grey-300"
          )}
        >
          <span className={cn("flex-1 text-[14px] leading-[1.4] tracking-[0.14px]", node ? "text-foreground" : "text-grey-500")}>
            {node ? node.name : m["safe.node_ph"]()}
          </span>
          <ChevronDown className="size-5 text-grey-500" aria-hidden="true" />
        </button>
      </div>
      {node ? <SafeNodeCard node={node} /> : null}
      {full ? <AllFullCard onAlternatives={onAlternatives} /> : null}
    </div>
  );
}

/** The grey availability card under the picked node — green count or the fully-booked + notify state. */
function SafeNodeCard({node}: {node: SafeNode}) {
  const full = node.safes === 0;
  return (
    <div className="flex w-full flex-col gap-1 rounded-[12px] bg-[#f9f9f9] p-4">
      <div className="flex w-full items-center justify-between">
        <p className="text-[16px] font-medium leading-[1.4] tracking-[0.16px] text-foreground">{node.name}</p>
        {full ? (
          <span className="flex items-center gap-1">
            <span aria-hidden="true" className="size-2 rounded-[20px] bg-status-fail" />
            <span className="text-[12px] leading-[1.4] tracking-[0.12px] text-status-fail-dark">{m["safe.fully_booked"]()}</span>
          </span>
        ) : null}
      </div>
      <p className="text-[12px] leading-[1.4] tracking-[0.12px] text-grey-500">{`${node.distance} • ${node.floor}`}</p>
      <p className="text-[12px] leading-[1.4] tracking-[0.12px] text-grey-500">{node.access}</p>
      {full ? (
        <button
          type="button"
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#f2f2f2] px-4 py-2.5 text-[14px] font-medium leading-[1.4] tracking-[0.14px] text-primary-500"
        >
          <Bell className="size-[18px]" aria-hidden="true" />
          {m["safe.notify_full"]()}
        </button>
      ) : (
        <span className="flex items-center gap-1">
          <span aria-hidden="true" className="size-2 rounded-[20px] bg-success-400" />
          <span className="text-[12px] leading-[1.4] tracking-[0.12px] text-success-600">
            {m["safe.safes_available"]({count: node.safes, sizes: node.sizes})}
          </span>
        </span>
      )}
    </div>
  );
}

/** "All lockers full" card — points back to the picker for a different node. */
function AllFullCard({onAlternatives}: {onAlternatives: () => void}) {
  return (
    <div className="flex w-full flex-col gap-4 rounded-[12px] bg-[#f9f9f9] p-4">
      <div className="flex w-full flex-col gap-1">
        <p className="text-[16px] font-medium leading-[1.4] tracking-[0.16px] text-foreground">{m["safe.full_title"]()}</p>
        <p className="text-[14px] leading-[1.4] tracking-[0.14px] text-grey-500">{m["safe.full_desc"]()}</p>
      </div>
      <Button className="w-full text-[16px] font-medium" onClick={onAlternatives}>
        {m["safe.view_alt"]()}
      </Button>
    </div>
  );
}
