import {errorText} from "@/components/form/error-text";
import {FormField} from "@/components/form/form-field";
import {SelectInput} from "@/components/form/select-input";
import {TextInput} from "@/components/form/text-input";
import type {FieldErrors} from "@/lib/signup-validation";
import {m} from "@/paraglide/messages";
import type {VehicleDetails} from "@/types/signup-types";
import {StepHeading} from "./step-heading";
import {UploadField} from "./upload-field";

const VEHICLE_TYPES = ["motorcycle", "bicycle", "car", "van"] as const;

interface StepVehicleProps {
  vehicle: VehicleDetails;
  errors: FieldErrors;
  onChange: (field: keyof VehicleDetails, value: string) => void;
}

export function StepVehicle({vehicle, errors, onChange}: StepVehicleProps) {
  return (
    <div className="flex flex-col gap-6">
      <StepHeading title={m["su.vehicle_title"]()} description={m["su.vehicle_desc"]()} />
      <div className="flex flex-col gap-5">
        <FormField label={m["su.vehicle_type"]()} error={errorText(errors.type)}>
          {(c) => (
            <SelectInput {...c} value={vehicle.type} onChange={(e) => onChange("type", e.target.value)}>
              <option value="" disabled>
                {m["su.vehicle_type_ph"]()}
              </option>
              {VEHICLE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {m[`su.vehicle_${type}`]()}
                </option>
              ))}
            </SelectInput>
          )}
        </FormField>
        <FormField label={m["su.brand"]()} error={errorText(errors.brand)}>
          {(c) => (
            <TextInput {...c} value={vehicle.brand} onChange={(e) => onChange("brand", e.target.value)} placeholder={m["su.brand_ph"]()} />
          )}
        </FormField>
        <FormField label={m["su.plate"]()} error={errorText(errors.plate)}>
          {(c) => (
            <TextInput {...c} value={vehicle.plate} onChange={(e) => onChange("plate", e.target.value)} placeholder={m["su.plate_ph"]()} />
          )}
        </FormField>
        <FormField label={m["su.vehicle_photo"]()} error={errorText(errors.vehiclePhoto)}>
          {(c) => <UploadField {...c} fileName={vehicle.vehiclePhotoName} onSelect={(name) => onChange("vehiclePhotoName", name)} />}
        </FormField>
        <FormField label={m["su.license_photo"]()} error={errorText(errors.licensePhoto)}>
          {(c) => <UploadField {...c} fileName={vehicle.licensePhotoName} onSelect={(name) => onChange("licensePhotoName", name)} />}
        </FormField>
      </div>
    </div>
  );
}
