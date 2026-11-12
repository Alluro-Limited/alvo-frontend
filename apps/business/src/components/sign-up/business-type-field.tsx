import {ChevronDown} from "lucide-react";
import {cn} from "cnfast";
import {
  Select,
  SelectIcon,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPopup,
  SelectPortal,
  SelectPositioner,
  SelectTrigger,
  SelectValue,
} from "@alvo/ui";
import {m} from "@/paraglide/messages";
import {FormField} from "@/components/auth/form-field";
import {authInputClassName} from "@/components/auth/auth-input-styles";
import {businessTypeOptions} from "./business-type-options";

interface BusinessTypeFieldProps {
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

/** The business-type dropdown: a styled select that matches the other auth inputs, grey until chosen. */
export function BusinessTypeField({value, error, onChange}: BusinessTypeFieldProps) {
  return (
    <FormField label={m["sign_up.business_type_label"]()} error={error}>
      {(control) => (
        <Select
          name="businessType"
          items={businessTypeOptions.map((option) => ({value: option.value, label: option.label()}))}
          value={value || null}
          onValueChange={(next) => onChange(next ?? "")}
        >
          <SelectTrigger {...control} className={cn(authInputClassName, "pr-4 text-sm data-[placeholder]:text-grey-500")}>
            <SelectValue placeholder={m["sign_up.business_type_placeholder"]()} />
            <SelectIcon>
              <ChevronDown className="size-5" strokeWidth={1.5} aria-hidden="true" />
            </SelectIcon>
          </SelectTrigger>
          <SelectPortal>
            <SelectPositioner>
              <SelectPopup>
                {businessTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <SelectItemText>{option.label()}</SelectItemText>
                    <SelectItemIndicator />
                  </SelectItem>
                ))}
              </SelectPopup>
            </SelectPositioner>
          </SelectPortal>
        </Select>
      )}
    </FormField>
  );
}
