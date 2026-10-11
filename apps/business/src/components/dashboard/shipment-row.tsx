import {StatusTag} from "@alvo/ui";
import {cn} from "cnfast";
import {m} from "@/paraglide/messages";
import type {RecentShipment, ShipmentStatus} from "@/types/dashboard-types";

const STATUS_TAG: Record<ShipmentStatus, "pending" | "pickup" | "fail" | "success"> = {
  in_transit: "pending",
  delayed: "pickup",
  failed: "fail",
  delivered: "success",
};

const STATUS_LABEL: Record<ShipmentStatus, () => string> = {
  in_transit: m["shipments.status_in_transit"],
  delayed: m["shipments.status_delayed"],
  failed: m["shipments.status_failed"],
  delivered: m["shipments.status_delivered"],
};

const cellClass = "text-sm leading-[1.4] tracking-[0.14px] whitespace-nowrap text-grey-600";

function SizeChip({size}: {size: string}) {
  return (
    <span className="inline-flex items-center rounded-[2px] border-[0.5px] border-grey-500 bg-grey-100 p-2 text-xs leading-[1.4] tracking-[0.24px] text-grey-600">
      {size}
    </span>
  );
}

function PriorityText({priority}: {priority: RecentShipment["priority"]}) {
  const isExpress = priority === "express";
  return (
    <span
      className={cn(
        "rounded-full py-2 pr-2.5 pl-2 text-sm leading-[1.4] tracking-[0.14px]",
        isExpress ? "text-status-warning-dark" : "text-primary-700"
      )}
    >
      {isExpress ? m["shipments.priority_express"]() : m["shipments.priority_standard"]()}
    </span>
  );
}

function ActionCell({status}: {status: ShipmentStatus}) {
  if (status !== "failed") {
    return <span className="text-sm leading-[1.4] tracking-[0.14px] text-grey-500">—</span>;
  }
  return (
    <button type="button" className="text-sm leading-[1.4] font-medium tracking-[0.28px] text-primary-500 underline">
      {m["shipments.resolve"]()}
    </button>
  );
}

const cell = "border-t-[0.75px] border-grey-300 px-4 align-middle";

/** One 52px row of the Recent shipments table. */
export function ShipmentRow({shipment}: {shipment: RecentShipment}) {
  return (
    <tr className="h-[52px] bg-white">
      <td className={cell}>
        <span className={cellClass}>{shipment.recipient}</span>
      </td>
      <td className={cell}>
        <span className={cellClass}>{shipment.phone}</span>
      </td>
      <td className={cell}>
        <span className={cellClass}>{shipment.destination}</span>
      </td>
      <td className={cell}>
        <SizeChip size={shipment.size} />
      </td>
      <td className={cell}>
        <PriorityText priority={shipment.priority} />
      </td>
      <td className={cell}>
        <StatusTag status={STATUS_TAG[shipment.status]}>{STATUS_LABEL[shipment.status]()}</StatusTag>
      </td>
      <td className={cell}>
        <ActionCell status={shipment.status} />
      </td>
    </tr>
  );
}
