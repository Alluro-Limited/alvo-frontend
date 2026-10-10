import {StatusTag} from "@alvo/ui";
import {m} from "@/paraglide/messages";
import type {PayoutDelivery} from "@/types/payouts-types";
import {trackTypeLabel} from "@/components/couriers/courier-labels";
import {formatJoined, formatNairaAmount} from "@/lib/format";

const DELIVERY_STATUS_LABELS: Record<PayoutDelivery["status"], () => string> = {
  completed: m["payout.status_completed"],
  cancelled: m["payout.status_cancelled"],
  failed: m["payout.status_failed"],
};

const DELIVERY_STATUS_TAGS: Record<PayoutDelivery["status"], "success" | "pending" | "fail"> = {
  completed: "success",
  cancelled: "pending",
  failed: "fail",
};

const HEADERS = [
  m["payout.deliveries_col_date"],
  m["payout.deliveries_col_id"],
  m["payout.deliveries_col_type"],
  m["payout.deliveries_col_route"],
  m["payout.deliveries_col_earned"],
  m["payout.deliveries_col_items"],
  m["payout.deliveries_col_status"],
];

/** The delivery rows inside the View Deliveries modal. */
export function DeliveriesTable({rows}: {rows: PayoutDelivery[]}) {
  return (
    <table className="w-full" aria-label={m["payout.deliveries_title"]()}>
      <thead>
        <tr className="border-b border-grey-200 text-left">
          {HEADERS.map((label) => (
            <th key={label()} className="h-10 pr-4 text-xs leading-[1.4] font-medium tracking-[0.12px] whitespace-nowrap text-grey-500">
              {label()}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <DeliveryRow key={row.id} row={row} />
        ))}
      </tbody>
    </table>
  );
}

function DeliveryRow({row}: {row: PayoutDelivery}) {
  return (
    <tr className="border-b border-grey-200 last:border-0">
      <td className="h-12 pr-4 text-sm text-grey-600">{formatJoined(row.date)}</td>
      <td className="h-12 pr-4 text-sm font-medium text-black">{row.id}</td>
      <td className="h-12 pr-4 text-sm text-grey-600">{trackTypeLabel(row.type)}</td>
      <td className="h-12 max-w-[260px] truncate pr-4 text-sm text-grey-600">{`${row.pickup} → ${row.dropoff}`}</td>
      <td className="h-12 pr-4 text-sm font-medium text-black">{`₦${formatNairaAmount(row.earned)}`}</td>
      <td className="h-12 pr-4 text-sm text-grey-600">
        {row.items === 1 ? m["payout.deliveries_items_one"]({count: row.items}) : m["payout.deliveries_items"]({count: row.items})}
      </td>
      <td className="h-12 pr-4">
        <StatusTag status={DELIVERY_STATUS_TAGS[row.status]}>{DELIVERY_STATUS_LABELS[row.status]()}</StatusTag>
      </td>
    </tr>
  );
}
