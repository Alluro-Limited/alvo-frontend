import {Minus, Plus} from "lucide-react";
import {m} from "@/paraglide/messages";
import type {WizardForm} from "./register-wizard-types";

interface StepProps {
  form: WizardForm;
  showErrors: boolean;
  onChange: <K extends keyof WizardForm>(key: K, value: WizardForm[K]) => void;
}

interface CounterRowProps {
  label: string;
  hint: string;
  value: number;
  step: number;
  onChange: (value: number) => void;
}

function CounterRow({label, hint, value, step, onChange}: CounterRowProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-grey-200 p-3">
      <div className="flex flex-col">
        <p className="text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{label}</p>
        <p className="text-xs leading-[1.4] tracking-[0.12px] text-grey-500">{hint}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label={m["nodes.counter_decrease_aria"]({label})}
          disabled={value <= 0}
          onClick={() => onChange(Math.max(0, value - step))}
          className="flex size-8 items-center justify-center rounded-lg border border-grey-300 text-grey-600 disabled:opacity-40"
        >
          <Minus className="size-4" aria-hidden="true" />
        </button>
        <span className="w-10 text-center text-base leading-[1.4] font-semibold tracking-[0.16px] text-black" aria-live="polite">
          {value}
        </span>
        <button
          type="button"
          aria-label={m["nodes.counter_increase_aria"]({label})}
          onClick={() => onChange(value + step)}
          className="flex size-8 items-center justify-center rounded-lg border border-primary-500 text-primary-500"
        >
          <Plus className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

/** Step 3 — compartment counters for each size plus the drop-off bay kilograms. */
export function WizardStepCapacity({form, showErrors, onChange}: StepProps) {
  const empty = form.small + form.medium + form.large + form.dropoffKg === 0;
  return (
    <div className="flex flex-col gap-3">
      <CounterRow
        label={m["nodes.capacity_small"]()}
        hint={m["nodes.capacity_small_hint"]()}
        value={form.small}
        step={1}
        onChange={(v) => onChange("small", v)}
      />
      <CounterRow
        label={m["nodes.capacity_medium"]()}
        hint={m["nodes.capacity_medium_hint"]()}
        value={form.medium}
        step={1}
        onChange={(v) => onChange("medium", v)}
      />
      <CounterRow
        label={m["nodes.capacity_large"]()}
        hint={m["nodes.capacity_large_hint"]()}
        value={form.large}
        step={1}
        onChange={(v) => onChange("large", v)}
      />
      <CounterRow
        label={m["nodes.capacity_dropoff"]()}
        hint={m["nodes.capacity_dropoff_hint"]()}
        value={form.dropoffKg}
        step={100}
        onChange={(v) => onChange("dropoffKg", v)}
      />
      {showErrors && empty && <p className="text-xs leading-[1.4] tracking-[0.01em] text-status-fail">{m["nodes.error_capacity"]()}</p>}
    </div>
  );
}
