import {m} from "@/paraglide/messages";
import {AuthTextField} from "@/components/auth/text-field";
import {FormField} from "@/components/auth/form-field";
import {SelectInput} from "@/components/auth/select-input";
import type {useBatchWizard} from "./use-batch-wizard";

/** Step 1: batch name, origin locker, and optional internal notes. */
export function BatchDetailsStep({wizard}: {wizard: ReturnType<typeof useBatchWizard>}) {
  const {details} = wizard;
  const nameError = details.step1Attempted && details.name.trim() === "" ? m["wiz.name_required"]() : undefined;
  return (
    <div className="flex w-full flex-col gap-8 p-6">
      <div className="flex w-full flex-col gap-1">
        <h2 className="text-lg leading-[1.2] font-medium text-black">{m["wiz.step1"]()}</h2>
        <p className="text-xs leading-[1.4] tracking-[0.12px] text-black opacity-50">{m["wiz.details_sub"]()}</p>
      </div>
      <div className="flex w-full flex-col gap-6">
        <AuthTextField
          label={m["wiz.batch_name"]()}
          error={nameError}
          hint={m["wiz.batch_name_help"]()}
          value={details.name}
          onChange={(event) => details.setName(event.target.value)}
          placeholder={m["wiz.batch_name_ph"]()}
        />
        <FormField label={m["wiz.origin"]()}>
          {(control) => (
            <SelectInput {...control} value={details.origin} onChange={(event) => details.setOriginLockerId(event.target.value)}>
              {wizard.lockers.map((locker) => (
                <option key={locker.id} value={locker.id}>
                  {locker.name}
                </option>
              ))}
            </SelectInput>
          )}
        </FormField>
        <FormField label={m["wiz.notes"]()}>
          {(control) => (
            <textarea
              {...control}
              rows={3}
              value={details.notes}
              onChange={(event) => details.setNotes(event.target.value)}
              placeholder={m["wiz.notes_ph"]()}
              className="w-full resize-none rounded-xl border border-grey-300 px-4 py-3 text-sm leading-[1.4] tracking-[0.01em] text-primary-900 placeholder:text-grey-500"
            />
          )}
        </FormField>
      </div>
    </div>
  );
}
