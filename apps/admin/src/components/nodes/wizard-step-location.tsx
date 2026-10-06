import {Input} from "@alvo/ui";
import {FormField} from "@/components/auth/form-field";
import {m} from "@/paraglide/messages";
import {parseCoordinate, validCoordinate, type WizardForm} from "./register-wizard-types";
import {WizardMapPreview} from "./wizard-map-preview";

interface StepProps {
  form: WizardForm;
  showErrors: boolean;
  onChange: <K extends keyof WizardForm>(key: K, value: WizardForm[K]) => void;
}

const required = (value: string) => (value.trim() === "" ? m["nodes.error_required"]() : undefined);
const coordinate = (value: string, min: number, max: number) =>
  validCoordinate(value, min, max) ? undefined : m["nodes.error_coordinates"]();

/** Step 2 — zone, full address, map preview, and coordinates. */
export function WizardStepLocation({form, showErrors, onChange}: StepProps) {
  return (
    <div className="flex flex-col gap-4">
      <FormField label={m["nodes.field_zone"]()} error={showErrors ? required(form.zone) : undefined}>
        {(control) => (
          <Input
            {...control}
            value={form.zone}
            placeholder={m["nodes.field_zone_placeholder"]()}
            onChange={(event) => onChange("zone", event.target.value)}
          />
        )}
      </FormField>
      <FormField label={m["nodes.field_address"]()} error={showErrors ? required(form.address) : undefined}>
        {(control) => (
          <Input
            {...control}
            value={form.address}
            placeholder={m["nodes.field_address_placeholder"]()}
            onChange={(event) => onChange("address", event.target.value)}
          />
        )}
      </FormField>
      <WizardMapPreview latitude={parseCoordinate(form.latitude)} longitude={parseCoordinate(form.longitude)} />
      <div className="grid grid-cols-2 gap-4">
        <CoordinateField form={form} showErrors={showErrors} onChange={onChange} axis="latitude" />
        <CoordinateField form={form} showErrors={showErrors} onChange={onChange} axis="longitude" />
      </div>
    </div>
  );
}

function CoordinateField({form, showErrors, onChange, axis}: StepProps & {axis: "latitude" | "longitude"}) {
  const label = axis === "latitude" ? m["nodes.field_latitude"] : m["nodes.field_longitude"];
  const placeholder = axis === "latitude" ? m["nodes.field_latitude_placeholder"] : m["nodes.field_longitude_placeholder"];
  return (
    <FormField
      label={label()}
      error={showErrors ? coordinate(form[axis], axis === "latitude" ? -90 : -180, axis === "latitude" ? 90 : 180) : undefined}
    >
      {(control) => (
        <Input
          {...control}
          value={form[axis]}
          inputMode="decimal"
          placeholder={placeholder()}
          onChange={(event) => onChange(axis, event.target.value)}
        />
      )}
    </FormField>
  );
}
