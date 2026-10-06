import {Input} from "@alvo/ui";
import {FormField} from "@/components/auth/form-field";
import {m} from "@/paraglide/messages";
import type {WizardForm} from "./register-wizard-types";

interface StepProps {
  form: WizardForm;
  showErrors: boolean;
  onChange: <K extends keyof WizardForm>(key: K, value: WizardForm[K]) => void;
}

const required = (value: string) => (value.trim() === "" ? m["nodes.error_required"]() : undefined);

/** Step 1 — name, partner host, and region. */
export function WizardStepBasic({form, showErrors, onChange}: StepProps) {
  return (
    <div className="flex flex-col gap-4">
      <FormField label={m["nodes.field_node_name"]()} error={showErrors ? required(form.name) : undefined}>
        {(control) => (
          <Input
            {...control}
            value={form.name}
            placeholder={m["nodes.field_node_name_placeholder"]()}
            onChange={(event) => onChange("name", event.target.value)}
          />
        )}
      </FormField>
      <FormField label={m["nodes.field_partner"]()} error={showErrors ? required(form.partner) : undefined}>
        {(control) => (
          <Input
            {...control}
            value={form.partner}
            placeholder={m["nodes.field_partner_placeholder"]()}
            onChange={(event) => onChange("partner", event.target.value)}
          />
        )}
      </FormField>
      <FormField label={m["nodes.field_region"]()} error={showErrors ? required(form.region) : undefined}>
        {(control) => (
          <Input
            {...control}
            value={form.region}
            placeholder={m["nodes.field_region_placeholder"]()}
            onChange={(event) => onChange("region", event.target.value)}
          />
        )}
      </FormField>
    </div>
  );
}
