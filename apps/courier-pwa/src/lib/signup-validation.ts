import type {SimpleMessage} from "@/lib/i18n";
import type {CourierApplicationDraft, ExperienceDetails, PersonalDetails, VehicleDetails} from "@/types/signup-types";

export type MessageKey = SimpleMessage;

/** Field name → i18n error key. */
export type FieldErrors = Partial<Record<string, MessageKey>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validatePersonal(p: PersonalDetails): FieldErrors {
  const errors: FieldErrors = {};
  if (!p.firstName.trim()) errors.firstName = "su.err_first_name";
  if (!p.lastName.trim()) errors.lastName = "su.err_last_name";
  if (p.phone.replace(/\D/g, "").length < 7) errors.phone = "su.err_phone";
  if (!EMAIL_PATTERN.test(p.email)) errors.email = "su.err_email";
  if (!p.gender) errors.gender = "su.err_gender";
  if (!p.birthYear || !p.birthMonth || !p.birthDay) errors.dob = "su.err_dob";
  if (!p.nin.trim()) errors.nin = "su.err_nin";
  return errors;
}

export function validateExperience(e: ExperienceDetails): FieldErrors {
  const errors: FieldErrors = {};
  if (!e.workedBefore) errors.workedBefore = "su.err_worked_before";
  if (e.workedBefore === "yes") {
    if (!e.company.trim()) errors.company = "su.err_company";
    if (!e.years) errors.years = "su.err_years";
  }
  return errors;
}

export function validateVehicle(v: VehicleDetails): FieldErrors {
  const errors: FieldErrors = {};
  if (!v.type) errors.type = "su.err_vehicle_type";
  if (!v.brand.trim()) errors.brand = "su.err_brand";
  if (!v.plate.trim()) errors.plate = "su.err_plate";
  if (!v.vehiclePhotoName) errors.vehiclePhoto = "su.err_vehicle_photo";
  if (!v.licensePhotoName) errors.licensePhoto = "su.err_license_photo";
  return errors;
}

export function validateArea(d: CourierApplicationDraft): FieldErrors {
  return d.deliveryArea ? {} : {deliveryArea: "su.err_area"};
}
