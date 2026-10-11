import {m} from "@/paraglide/messages";
import type {ShipmentPriority, ShipmentSize} from "@/types/dashboard-types";
import type {Locker} from "@/types/shipment-types";
import type {RecipientDraft} from "./recipient-draft";
import {RowSelect} from "./row-select";

interface RecipientSelectsProps {
  recipient: RecipientDraft;
  lockers: Locker[];
  showErrors: boolean;
  onChange: (recipient: RecipientDraft) => void;
}

/** The row's three dropdowns: destination locker, size, and priority. */
export function RecipientSelects({recipient, lockers, showErrors, onChange}: RecipientSelectsProps) {
  const patch = (part: Partial<RecipientDraft>) => onChange({...recipient, ...part});
  return (
    <>
      <RowSelect
        ariaLabel={m["batch.col_destination"]()}
        value={recipient.lockerId}
        invalid={showErrors && !lockers.some((locker) => locker.id === recipient.lockerId)}
        onChange={(lockerId) => patch({lockerId})}
      >
        <option value="" disabled>
          {m["batch.destination_ph"]()}
        </option>
        {lockers.map((locker) => (
          <option key={locker.id} value={locker.id}>
            {locker.name}
          </option>
        ))}
      </RowSelect>
      <RowSelect
        ariaLabel={m["batch.col_size"]()}
        value={recipient.size}
        invalid={false}
        onChange={(size) => patch({size: size as ShipmentSize})}
      >
        <option value="S">S</option>
        <option value="M">M</option>
        <option value="B">B</option>
      </RowSelect>
      <RowSelect
        ariaLabel={m["batch.col_priority"]()}
        value={recipient.priority}
        invalid={false}
        onChange={(priority) => patch({priority: priority as ShipmentPriority})}
      >
        <option value="standard">{m["shipments.priority_standard"]()}</option>
        <option value="express">{m["shipments.priority_express"]()}</option>
      </RowSelect>
    </>
  );
}
