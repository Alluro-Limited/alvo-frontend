import type {RegisterNodeInput} from "@/types/nodes-types";

/** Editable form state collected across the four wizard steps — strings until submit. */
export interface WizardForm {
  name: string;
  partner: string;
  region: string;
  zone: string;
  address: string;
  latitude: string;
  longitude: string;
  small: number;
  medium: number;
  large: number;
  dropoffKg: number;
}

export const EMPTY_WIZARD_FORM: WizardForm = {
  name: "",
  partner: "",
  region: "",
  zone: "",
  address: "",
  latitude: "",
  longitude: "",
  small: 0,
  medium: 0,
  large: 0,
  dropoffKg: 0,
};

export function parseCoordinate(value: string): number | null {
  const parsed = Number(value.trim());
  return value.trim() !== "" && Number.isFinite(parsed) ? parsed : null;
}

export function validCoordinate(value: string, min: number, max: number): boolean {
  const parsed = parseCoordinate(value);
  return parsed !== null && parsed >= min && parsed <= max;
}

/** Per-step validity — the Continue button checks this before advancing. */
export function stepValid(step: number, form: WizardForm): boolean {
  if (step === 0) return form.name.trim() !== "" && form.partner.trim() !== "" && form.region.trim() !== "";
  if (step === 1) {
    return (
      form.zone.trim() !== "" &&
      form.address.trim() !== "" &&
      validCoordinate(form.latitude, -90, 90) &&
      validCoordinate(form.longitude, -180, 180)
    );
  }
  if (step === 2) return form.small + form.medium + form.large + form.dropoffKg > 0;
  return true;
}

/** Turns the collected form into the service payload. Only called once every step validates. */
export function toRegisterInput(form: WizardForm): RegisterNodeInput {
  return {
    name: form.name.trim(),
    partner: form.partner.trim(),
    region: form.region.trim(),
    zone: form.zone.trim(),
    address: form.address.trim(),
    latitude: parseCoordinate(form.latitude) ?? 0,
    longitude: parseCoordinate(form.longitude) ?? 0,
    capacity: {small: form.small, medium: form.medium, large: form.large, dropoffKg: form.dropoffKg},
  };
}
