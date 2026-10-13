import {Checkbox} from "@alvo/ui";
import {NodeField} from "./node-field";
import {SpeedPicker} from "./speed-picker";
import {CostCard} from "./cost-card";
import type {DeliverySpeed, LockerNode, NodeRole, SendQuote} from "@/types/send-types";
import {m} from "@/paraglide/messages";

interface NodesStepProps {
  origin: LockerNode | null;
  destination: LockerNode | null;
  favorite: boolean;
  speed: DeliverySpeed;
  quote: SendQuote | null;
  quoteLoading: boolean;
  onOpenPicker: (role: NodeRole) => void;
  onFavorite: (value: boolean) => void;
  onSpeed: (speed: DeliverySpeed) => void;
}

/** Step 3 — drop-off/pickup node pickers, favorite checkbox, delivery speed, and the live cost card. */
export function NodesStep({origin, destination, favorite, speed, quote, quoteLoading, onOpenPicker, onFavorite, onSpeed}: NodesStepProps) {
  const ready = origin !== null && destination !== null;
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex w-full flex-col gap-3">
        <div className="flex w-full flex-col gap-6">
          <NodeField
            label={m["send.origin"]()}
            placeholder={m["send.origin_ph"]()}
            node={origin}
            onOpen={() => onOpenPicker("origin")}
            onAlternative={() => onOpenPicker("origin")}
          />
          <NodeField
            label={m["send.dest"]()}
            placeholder={m["send.dest_ph"]()}
            node={destination}
            onOpen={() => onOpenPicker("destination")}
            onAlternative={() => onOpenPicker("destination")}
          />
        </div>
        <div className="flex w-full items-center gap-2">
          <Checkbox checked={favorite} onCheckedChange={(checked) => onFavorite(checked === true)} aria-label={m["send.favorite"]()} />
          <span className="text-[14px] leading-[1.4] tracking-[0.14px] text-primary-850">{m["send.favorite"]()}</span>
        </div>
      </div>
      <SpeedPicker value={speed} onChange={onSpeed} />
      {ready ? <CostCard title={m["send.est_cost"]()} desc={m["send.est_desc"]()} quote={quote} loading={quoteLoading} /> : null}
    </div>
  );
}
