import {CircleCheck, TriangleAlert} from "lucide-react";
import {cn} from "cnfast";
import {m} from "@/paraglide/messages";
import {lockerName, type RecipientDraft} from "@/components/new-shipment/recipient-draft";
import type {useBatchWizard} from "./use-batch-wizard";

const cell = "border-t-[0.75px] border-grey-300 px-4 py-3 text-left align-middle";
const cellText = "text-sm leading-[1.4] tracking-[0.14px] whitespace-nowrap text-grey-600";

function ReviewRow({
  recipient,
  error,
  lockers,
  onResolve,
}: {
  recipient: RecipientDraft;
  error: boolean;
  lockers: ReturnType<typeof useBatchWizard>["lockers"];
  onResolve: () => void;
}) {
  const priority = recipient.priority === "express" ? m["shipments.priority_express"]() : m["shipments.priority_standard"]();
  return (
    <tr className={cn(error && "bg-status-fail-subtle")}>
      <td className={cell}>
        <span className={cellText}>{recipient.name}</span>
      </td>
      <td className={cell}>
        <span className={cellText}>{recipient.phone}</span>
      </td>
      <td className={cell}>
        <span className={cellText}>{lockerName(lockers, recipient.lockerId) || recipient.lockerId}</span>
      </td>
      <td className={cell}>
        <span className="inline-flex items-center rounded-[2px] border-[0.5px] border-grey-500 bg-grey-100 p-2 text-xs leading-[1.4] tracking-[0.24px] text-grey-600">
          {recipient.size}
        </span>
      </td>
      <td className={cell}>
        <span className={cn(cellText, recipient.priority === "express" ? "text-status-warning-dark" : "text-primary-700")}>{priority}</span>
      </td>
      <td className={cell}>
        {error ? (
          <button
            type="button"
            onClick={onResolve}
            aria-label={`${m["wiz.review_resolve"]()} ${recipient.name}`}
            className="text-sm leading-[1.4] font-medium tracking-[0.28px] text-status-fail underline"
          >
            {m["wiz.review_resolve"]()}
          </button>
        ) : (
          <span className={cellText}>—</span>
        )}
      </td>
    </tr>
  );
}

const HEADERS = [
  m["batch.col_recipient"],
  m["batch.col_phone"],
  m["wiz.col_locker"],
  m["batch.col_size"],
  m["batch.col_priority"],
  m["wiz.col_action"],
];

function ReviewBanners({wizard}: {wizard: ReturnType<typeof useBatchWizard>}) {
  const {recipients} = wizard;
  return (
    <>
      {recipients.errors.length > 0 && (
        <div className="flex items-center gap-2 rounded-lg bg-status-warning-subtle px-3 py-2.5">
          <TriangleAlert className="size-4 shrink-0 text-status-warning" aria-hidden="true" />
          <p className="text-xs leading-[1.4] font-medium tracking-[0.12px] text-status-warning-dark">
            {m["wiz.review_warn"]({errors: recipients.errors.length, valid: recipients.validRows.length})}
          </p>
        </div>
      )}
      {recipients.validRows.length > 0 && (
        <div className="flex items-center gap-2 rounded-lg bg-success-50 px-3 py-2.5">
          <CircleCheck className="size-4 shrink-0 text-success-500" aria-hidden="true" />
          <p className="text-xs leading-[1.4] font-medium tracking-[0.12px] text-success-600">
            {m["wiz.review_ok"]({count: recipients.validRows.length})}
          </p>
        </div>
      )}
    </>
  );
}

/** Step 3: validate every row; the bad ones are excluded from payment unless fixed. */
export function ReviewStep({wizard}: {wizard: ReturnType<typeof useBatchWizard>}) {
  const {recipients} = wizard;
  const errorIds = new Set(recipients.errors.map((error) => error.recipient.id));
  return (
    <div className="flex w-full flex-col gap-4 p-6">
      <div className="flex w-full flex-col gap-1">
        <h2 className="text-lg leading-[1.2] font-medium text-black">{m["wiz.review_title"]()}</h2>
        <p className="text-xs leading-[1.4] tracking-[0.12px] text-black opacity-50">{m["wiz.review_sub"]()}</p>
      </div>
      <ReviewBanners wizard={wizard} />
      <table className="w-full border-separate border-spacing-0 rounded-lg border border-grey-300">
        <thead>
          <tr>
            {HEADERS.map((header) => (
              <th
                key={header()}
                className="border-b-[0.75px] border-grey-300 px-4 py-3 text-left text-sm leading-[1.4] font-medium tracking-[0.14px] text-black"
              >
                {header()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {recipients.recipients.map((recipient) => (
            <ReviewRow
              key={recipient.id}
              recipient={recipient}
              error={errorIds.has(recipient.id)}
              lockers={wizard.lockers}
              onResolve={wizard.resolveRow}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
