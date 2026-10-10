import {m} from "@/paraglide/messages";
import type {DeliveryType} from "@/types/assignment-types";
import {TYPE_TONES} from "./assignment-type-pill";

const CARDS: {type: DeliveryType; title: () => string; hint: () => string}[] = [
  {type: "bulk", title: m["assignment.type_bulk"], hint: m["assignment.type_bulk_hint"]},
  {type: "node", title: m["assignment.type_node"], hint: m["assignment.type_node_hint"]},
  {type: "express", title: m["assignment.type_express"], hint: m["assignment.type_express_hint"]},
];

/** The three delivery-type explainer cards under the metrics. */
export function AssignmentTypeCards() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {CARDS.map((card) => {
        const tone = TYPE_TONES[card.type];
        const Icon = tone.icon;
        return (
          <div key={card.type} className="flex items-center gap-3 rounded-lg bg-white p-4">
            <span className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${tone.classes}`}>
              <Icon className="size-4" aria-hidden="true" />
            </span>
            <div>
              <p className={`text-sm leading-[1.4] font-medium tracking-[0.14px] ${tone.classes.split(" ")[1]}`}>{card.title()}</p>
              <p className="text-xs leading-[1.4] tracking-[0.12px] text-grey-500">{card.hint()}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
