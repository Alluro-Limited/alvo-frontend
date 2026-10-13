import {AuthField} from "@/components/auth/auth-field";
import {DurationField} from "./duration-field";
import {SafeSizePicker} from "./safe-size-picker";
import type {SafeDuration, SafeSize, SafeSizeOption} from "@/types/safe-types";
import {m} from "@/paraglide/messages";

interface SafeOptionsStepProps {
  sizes: SafeSizeOption[];
  durations: SafeDuration[];
  size: SafeSize | null;
  durationId: string | null;
  storing: string;
  onSize: (size: SafeSize) => void;
  onDuration: (durationId: string) => void;
  onStoring: (value: string) => void;
}

/** Step 2 "Find a Safe" — locker-size radios, duration select, and the optional contents field. */
export function SafeOptionsStep({sizes, durations, size, durationId, storing, onSize, onDuration, onStoring}: SafeOptionsStepProps) {
  return (
    <div className="flex w-full flex-col gap-6">
      <SafeSizePicker sizes={sizes} value={size} onChange={onSize} />
      <DurationField durations={durations} value={durationId} onChange={onDuration} />
      <AuthField id="safe-storing" label={m["safe.storing"]()} value={storing} onChange={onStoring} placeholder={m["safe.storing_ph"]()} />
    </div>
  );
}
