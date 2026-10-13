export interface PersonalDetails {
  firstName: string;
  lastName: string;
  /** Local digits only — the +234 prefix is implied by the field. */
  phone: string;
  email: string;
  gender: string;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  nin: string;
}

export interface ExperienceDetails {
  /** Empty until the courier answers — drives the yes/no select and conditional fields. */
  workedBefore: "" | "yes" | "no";
  company: string;
  years: string;
}

export interface VehicleDetails {
  type: string;
  brand: string;
  plate: string;
  /** Selected file names — uploads are mocked until the backend exists. */
  vehiclePhotoName: string;
  licensePhotoName: string;
}

export interface CourierApplicationDraft {
  personal: PersonalDetails;
  experience: ExperienceDetails;
  vehicle: VehicleDetails;
  deliveryArea: string;
}

export interface ApplicationReceipt {
  applicationId: string;
}

export interface SignupService {
  submitApplication: (draft: CourierApplicationDraft) => Promise<ApplicationReceipt>;
}

export const EMPTY_DRAFT: CourierApplicationDraft = {
  personal: {firstName: "", lastName: "", phone: "", email: "", gender: "", birthYear: "", birthMonth: "", birthDay: "", nin: ""},
  experience: {workedBefore: "", company: "", years: ""},
  vehicle: {type: "", brand: "", plate: "", vehiclePhotoName: "", licensePhotoName: ""},
  deliveryArea: "",
};
