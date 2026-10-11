import {m} from "@/paraglide/messages";
import type {ShipmentMode} from "@/types/shipment-types";
import shipmentBulkUrl from "@/assets/shipment-bulk.svg";
import shipmentSingleUrl from "@/assets/shipment-single.svg";

interface ModeCardProps {
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
}

function ModeCard({icon, title, description, onClick}: ModeCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={title}
      className="flex w-[215px] cursor-pointer flex-col items-start gap-4 rounded-xl bg-[#f9f9f9] p-6 text-left transition-colors hover:bg-grey-100"
    >
      <img src={icon} alt="" aria-hidden="true" className="size-6" />
      <div className="flex w-full flex-col items-start gap-1">
        <p className="w-full text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{title}</p>
        <p className="w-full text-xs leading-[1.4] tracking-[0.12px] text-black opacity-70">{description}</p>
      </div>
    </button>
  );
}

/** The card's left column before a mode is picked: heading + the two shipment-type cards. */
export function ModeSelect({onSelect}: {onSelect: (mode: ShipmentMode) => void}) {
  return (
    <div className="flex w-[565px] flex-col items-start gap-8 p-6">
      <div className="flex w-full flex-col items-start gap-1">
        <h2 className="w-full text-lg leading-[1.2] font-medium text-black">{m["batch.create_title"]()}</h2>
        <p className="w-full text-xs leading-[1.4] tracking-[0.12px] text-black opacity-50">{m["batch.create_sub"]()}</p>
      </div>
      <div className="flex items-center gap-4">
        <ModeCard
          icon={shipmentSingleUrl}
          title={m["batch.single_title"]()}
          description={m["batch.single_sub"]()}
          onClick={() => onSelect("single")}
        />
        <ModeCard
          icon={shipmentBulkUrl}
          title={m["batch.bulk_title"]()}
          description={m["batch.bulk_sub"]()}
          onClick={() => onSelect("bulk")}
        />
      </div>
    </div>
  );
}
