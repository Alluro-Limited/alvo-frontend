import {m} from "@/paraglide/messages";

export const businessTypeOptions: {value: string; label: () => string}[] = [
  {value: "sme", label: m["sign_up.business_types.sme"]},
  {value: "ecommerce", label: m["sign_up.business_types.ecommerce"]},
  {value: "retail", label: m["sign_up.business_types.retail"]},
  {value: "corporate", label: m["sign_up.business_types.corporate"]},
  {value: "logistics", label: m["sign_up.business_types.logistics"]},
  {value: "other", label: m["sign_up.business_types.other"]},
];
