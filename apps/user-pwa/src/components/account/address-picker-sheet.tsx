import {useState} from "react";
import {MapPin, X} from "lucide-react";
import {AuthSheet} from "@/components/auth/auth-sheet";
import {useAddAddress} from "@/queries/use-account-queries";
import {useSendNodesQuery} from "@/queries/use-send-queries";
import type {LockerNode} from "@/types/send-types";
import {m} from "@/paraglide/messages";
import pinFillUrl from "@/assets/icon-pin-fill.svg";

interface AddressPickerSheetProps {
  open: boolean;
  onClose: () => void;
  /** Fired after the picked node has been saved — the page shows the "Address added" toast. */
  onAdded: () => void;
}

/** "Address" sheet — a searchable locker-node list; picking a row saves it to Saved Addresses. */
export function AddressPickerSheet({open, onClose, onAdded}: AddressPickerSheetProps) {
  const [query, setQuery] = useState("");
  const nodes = useSendNodesQuery();
  const add = useAddAddress();

  const close = () => {
    setQuery("");
    onClose();
  };

  const pick = (node: LockerNode) => {
    add.mutate(node, {
      onSuccess: () => {
        close();
        onAdded();
      },
    });
  };

  return (
    <AuthSheet open={open} onClose={close}>
      <div className="mt-2 flex h-[70dvh] w-full flex-col">
        <div className="flex w-full items-center justify-between">
          <h2 className="text-[20px] font-medium leading-[1.2] text-foreground">{m["adr.sheet_title"]()}</h2>
          <button type="button" onClick={close} aria-label={m["loc.close"]()} className="flex size-8 items-center justify-center">
            <X className="size-[18px]" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-4 flex w-full items-center gap-2 overflow-clip rounded-[8px] border-[0.75px] border-grey-300 px-4 py-3.5 focus-within:border-primary-500">
          <MapPin className="size-[22px] shrink-0 text-grey-500" aria-hidden="true" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={m["adr.search_ph"]()}
            aria-label={m["adr.search_ph"]()}
            className="min-w-0 flex-1 bg-transparent text-[14px] leading-[1.4] tracking-[0.14px] text-foreground placeholder:text-grey-500 focus:outline-none"
          />
        </div>
        <PickerResults nodes={nodes.data ?? []} loading={nodes.isLoading} pending={add.isPending} query={query} onPick={pick} />
      </div>
    </AuthSheet>
  );
}

interface PickerResultsProps {
  nodes: LockerNode[];
  loading: boolean;
  pending: boolean;
  query: string;
  onPick: (node: LockerNode) => void;
}

function PickerResults({nodes, loading, pending, query, onPick}: PickerResultsProps) {
  const needle = query.trim().toLowerCase();
  const visible = nodes.filter((n) => !needle || n.name.toLowerCase().includes(needle) || n.address.toLowerCase().includes(needle));

  return (
    <div className="mt-1 flex flex-1 flex-col overflow-y-auto">
      {loading ? (
        <div className="flex flex-col gap-2 py-4">
          <div className="skeleton h-12 w-full rounded-[8px]" />
          <div className="skeleton h-12 w-full rounded-[8px]" />
          <div className="skeleton h-12 w-full rounded-[8px]" />
        </div>
      ) : visible.length === 0 ? (
        <p className="py-8 text-center text-[14px] text-grey-500">{m["send.no_nodes"]()}</p>
      ) : (
        visible.map((node) => (
          <button
            key={node.id}
            type="button"
            onClick={() => onPick(node)}
            aria-label={node.name}
            disabled={pending}
            className="flex w-full items-center gap-2 border-b-[0.5px] border-grey-400 px-2 py-4 text-left disabled:opacity-70"
          >
            <img src={pinFillUrl} alt="" aria-hidden="true" className="size-5 shrink-0" />
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="text-[14px] font-medium leading-[1.4] tracking-[0.14px] text-foreground">{node.name}</span>
              <span className="text-[12px] leading-[1.4] tracking-[0.12px] text-grey-500">{node.address}</span>
            </span>
          </button>
        ))
      )}
    </div>
  );
}
