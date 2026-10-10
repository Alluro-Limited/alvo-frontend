import {m} from "@/paraglide/messages";
import type {PayoutPaymentMethod} from "@/types/payouts-types";
import {SelectShell} from "@/components/workloads/select-shell";
import {PAYMENT_METHOD_LABELS} from "./payout-labels";

const FIELD_LABEL = "mb-1.5 block text-sm leading-[1.4] font-medium tracking-[0.14px] text-black";
const FIELD_INPUT = "h-10 w-full rounded-lg border border-grey-300 bg-white px-3 text-sm text-black outline-none focus:border-primary-500";

export interface PayoutPaymentFieldsValue {
  method: PayoutPaymentMethod;
  date: string;
  remarks: string;
}

interface PayoutPaymentFieldsProps {
  value: PayoutPaymentFieldsValue;
  paymentMethods: PayoutPaymentMethod[];
  onChange: (value: PayoutPaymentFieldsValue) => void;
}

/** Payment type + date + remarks — shared by the single Mark-as-Paid and Batch Payout dialogs. */
export function PayoutPaymentFields({value, paymentMethods, onChange}: PayoutPaymentFieldsProps) {
  return (
    <div className="flex flex-col gap-4">
      <label className="block">
        <span className={FIELD_LABEL}>{m["payout.payment_type"]()}</span>
        <SelectShell
          value={value.method}
          onChange={(next) => onChange({...value, method: next as PayoutPaymentMethod})}
          wrapperClassName="w-full"
        >
          {paymentMethods.map((method) => (
            <option key={method} value={method}>
              {PAYMENT_METHOD_LABELS[method]()}
            </option>
          ))}
        </SelectShell>
      </label>
      <label className="block">
        <span className={FIELD_LABEL}>{m["payout.payment_date"]()}</span>
        <input
          type="date"
          value={value.date}
          onChange={(event) => onChange({...value, date: event.target.value})}
          className={FIELD_INPUT}
        />
      </label>
      <label className="block">
        <span className={FIELD_LABEL}>{m["payout.remarks"]()}</span>
        <textarea
          value={value.remarks}
          onChange={(event) => onChange({...value, remarks: event.target.value})}
          placeholder={m["payout.remarks_placeholder"]()}
          rows={3}
          className="w-full resize-none rounded-lg border border-grey-300 bg-white px-3 py-2.5 text-sm text-black outline-none placeholder:text-grey-400 focus:border-primary-500"
        />
      </label>
    </div>
  );
}
