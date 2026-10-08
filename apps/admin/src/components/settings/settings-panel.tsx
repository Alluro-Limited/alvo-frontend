import type {ReactNode} from "react";
import {cn} from "cnfast";
import {Button, Switch} from "@alvo/ui";
import {m} from "@/paraglide/messages";
import {SelectShell} from "@/components/workloads/select-shell";
import {ADMIN_INPUT} from "@/components/admins/admin-info-fields";

/** The right-hand settings card — title, subtitle, field rows, and the save bar. */
export function SettingsPanel({
  title,
  subtitle,
  saving,
  failed,
  onSave,
  children,
}: {
  title: string;
  subtitle: string;
  saving: boolean;
  failed: boolean;
  onSave: () => void;
  children: ReactNode;
}) {
  return (
    <section className="w-[651px] rounded-2xl border border-grey-200 bg-white p-6">
      <h2 className="text-lg leading-[1.4] font-semibold text-black">{title}</h2>
      <p className="pt-1 pb-5 text-sm leading-[1.4] tracking-[0.14px] text-grey-500">{subtitle}</p>
      <div className="flex flex-col divide-y divide-grey-200">{children}</div>
      <div className="flex items-center gap-3 pt-6">
        <Button isLoading={saving} onClick={onSave}>
          {saving ? m["settings.saving"]() : m["settings.save"]()}
        </Button>
        {failed && <p className="text-sm leading-[1.4] tracking-[0.14px] text-status-fail">{m["settings.save_error"]()}</p>}
      </div>
    </section>
  );
}

/** A settings row — label + helper text on the left, a fixed-width control on the right. */
export function SettingRow({label, subtitle, children}: {label: string; subtitle: string; children: ReactNode}) {
  return (
    <div className="flex items-center justify-between gap-6 py-4">
      <div>
        <p className="text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{label}</p>
        <p className="pt-0.5 text-xs leading-[1.4] tracking-[0.12px] text-grey-500">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

/** The 200px text/select control used by the general + payout rows. */
export function SettingSelect({
  id,
  value,
  options,
  onChange,
}: {
  id: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <SelectShell id={id} value={value} onChange={onChange} wrapperClassName="w-[200px] shrink-0">
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </SelectShell>
  );
}

export function SettingInput({id, label, value, onChange}: {id: string; label: string; value: string; onChange: (v: string) => void}) {
  return (
    <input
      id={id}
      aria-label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={cn(ADMIN_INPUT, "mt-0 w-[200px] shrink-0")}
    />
  );
}

/** Number field with a trailing unit label ("Days", "minutes"). */
export function SettingNumber({
  id,
  label,
  value,
  suffix,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  suffix: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex w-[200px] shrink-0 items-center gap-2">
      <input
        id={id}
        type="number"
        min={0}
        aria-label={label}
        value={value}
        onChange={(event) => onChange(Number(event.target.value) || 0)}
        className={cn(ADMIN_INPUT, "mt-0 w-[120px]")}
      />
      <span className="text-sm leading-[1.4] tracking-[0.14px] text-grey-500">{suffix}</span>
    </div>
  );
}

export function SettingSwitch({label, checked, onChange}: {label: string; checked: boolean; onChange: (v: boolean) => void}) {
  return <Switch checked={checked} onCheckedChange={onChange} aria-label={label} />;
}
