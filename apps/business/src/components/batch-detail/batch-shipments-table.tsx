import {m} from "@/paraglide/messages";
import type {BatchShipment} from "@/types/batch-types";
import {ShipmentStageChip} from "@/components/batches/batch-status-chip";

const COLUMNS: (() => string)[] = [
  m["batches.col_ship_id"],
  m["batches.col_recipient"],
  m["batches.col_phone"],
  m["batches.col_destination"],
  m["batches.col_size"],
  m["batches.col_status"],
  m["batches.col_action"],
];

const cell = "border-t-[0.75px] border-grey-300 px-4 align-middle";
const cellText = "text-sm leading-[1.4] tracking-[0.14px] whitespace-nowrap text-grey-600";

function ShipmentRow({shipment, onTrack}: {shipment: BatchShipment; onTrack: (id: string) => void}) {
  return (
    <tr className="h-[52px] bg-white">
      <td className={cell}>
        <span className={cellText}>{shipment.id}</span>
      </td>
      <td className={cell}>
        <span className={cellText}>{shipment.recipient}</span>
      </td>
      <td className={cell}>
        <span className={cellText}>{shipment.phone}</span>
      </td>
      <td className={cell}>
        <span className={cellText}>{shipment.destination}</span>
      </td>
      <td className={cell}>
        <span className="inline-flex items-center rounded-[2px] border-[0.5px] border-grey-500 bg-grey-100 p-2 text-xs leading-[1.4] tracking-[0.24px] text-grey-600">
          {shipment.size}
        </span>
      </td>
      <td className={cell}>
        <ShipmentStageChip stage={shipment.stage} />
      </td>
      <td className={cell}>
        <button
          type="button"
          onClick={() => onTrack(shipment.id)}
          className="text-sm leading-[1.4] font-medium tracking-[0.28px] text-primary-500 underline"
        >
          {m["batches.track"]()}
        </button>
      </td>
    </tr>
  );
}

/** The per-shipment table inside a batch detail: ID through Track action. */
export function BatchShipmentsTable({shipments, onTrack}: {shipments: BatchShipment[]; onTrack: (id: string) => void}) {
  return (
    <div className="w-full overflow-clip rounded-3xl border border-grey-200">
      <table className="w-full border-collapse">
        <thead>
          <tr className="h-[52px] bg-[#f9f9f9]">
            {COLUMNS.map((label) => (
              <th key={label()} scope="col" className="border-b-[0.5px] border-grey-300 px-4 text-left align-middle">
                <span className="text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{label()}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {shipments.map((shipment) => (
            <ShipmentRow key={shipment.id} shipment={shipment} onTrack={onTrack} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
