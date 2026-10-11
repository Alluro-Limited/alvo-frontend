import {cn} from "cnfast";
import {m} from "@/paraglide/messages";
import type {RecentShipment} from "@/types/dashboard-types";
import {ShipmentRow} from "./shipment-row";

function headerCell(label: () => string, width?: string) {
  return {label, width};
}

const COLUMNS = [
  headerCell(m["shipments.col_recipient"]),
  headerCell(m["shipments.col_phone"], "w-[158px]"),
  headerCell(m["shipments.col_destination"], "w-[231px]"),
  headerCell(m["shipments.col_size"], "w-[117px]"),
  headerCell(m["shipments.col_priority"], "w-[165px]"),
  headerCell(m["shipments.col_status"], "w-[166px]"),
  headerCell(m["shipments.col_action"], "w-[111px]"),
];

/** The Recent shipments table: 52px rows inside a 24px rounded, grey-bordered card. */
export function ShipmentsTable({shipments}: {shipments: RecentShipment[]}) {
  return (
    <div className="w-full overflow-clip rounded-3xl border border-grey-200">
      <table className="w-full border-collapse">
        <thead>
          <tr className="h-[52px] bg-[#f9f9f9]">
            {COLUMNS.map((column) => (
              <th
                key={column.label()}
                scope="col"
                className={cn("border-b-[0.5px] border-grey-300 px-4 text-left align-middle", column.width)}
              >
                <span className="text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{column.label()}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {shipments.map((shipment) => (
            <ShipmentRow key={shipment.id} shipment={shipment} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
