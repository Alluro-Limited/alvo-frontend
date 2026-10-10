import {m} from "@/paraglide/messages";
import {TYPE_SHORT_LABELS} from "@/components/assignment/assignment-labels";
import type {DeliveryType} from "@/types/assignment-types";
import type {
  CourierDeleteReason,
  CourierMotion,
  CourierServiceTier,
  CourierStatus,
  CourierSuspendReason,
  CourierTrackStatus,
  CourierVerification,
  CourierVerificationItemKey,
  VehicleType,
} from "@/types/couriers-types";

export const COURIER_STATUS_LABELS: Record<CourierStatus, () => string> = {
  active: m["couriers.status_active"],
  flagged: m["couriers.status_flagged"],
  suspended: m["couriers.status_suspended"],
};

export const COURIER_VERIFICATION_LABELS: Record<CourierVerification, () => string> = {
  verified: m["couriers.verification_verified"],
  pending: m["couriers.verification_pending"],
};

export const VEHICLE_LABELS: Record<VehicleType, () => string> = {
  bicycle: m["couriers.vehicle_bicycle"],
  car: m["couriers.vehicle_car"],
  motorcycle: m["couriers.vehicle_motorcycle"],
  van: m["couriers.vehicle_van"],
};

export const TRACK_STATUS_LABELS: Record<CourierTrackStatus, () => string> = {
  in_transit: m["couriers.track_in_transit"],
  delayed: m["couriers.track_delayed"],
};

export const MOTION_LABELS: Record<CourierMotion, () => string> = {
  enroute: m["couriers.track_enroute"],
  idle: m["couriers.track_idle"],
};

export const TIER_LABELS: Record<CourierServiceTier, () => string> = {
  standard: m["couriers.tier_standard"],
  express: m["couriers.tier_express"],
};

export const VERIFICATION_ITEM_LABELS: Record<CourierVerificationItemKey, () => string> = {
  phone_email: m["couriers.item_phone_email"],
  id_account: m["couriers.item_id_account"],
  drivers_licence: m["couriers.item_drivers_licence"],
  vehicle_photo: m["couriers.item_vehicle_photo"],
  background_check: m["couriers.item_background_check"],
};

const SUSPEND_REASON_LABELS: Record<CourierSuspendReason, () => string> = {
  gps_tampering: m["couriers.reason_gps_tampering"],
  safety_incident: m["couriers.reason_safety_incident"],
  policy_violations: m["couriers.reason_policy_violations"],
  recipient_complaint: m["couriers.reason_recipient_complaint"],
  fraud: m["couriers.reason_fraud"],
  other: m["couriers.reason_other"],
};

const DELETE_REASON_LABELS: Record<CourierDeleteReason, () => string> = {
  account_closed: m["couriers.delete_reason_account_closed"],
  policy_violations: m["couriers.reason_policy_violations"],
  fraud: m["couriers.reason_fraud"],
  inactive: m["couriers.delete_reason_inactive"],
  other: m["couriers.reason_other"],
};

/** Fallback-tolerant labels for backend-supplied filter/reason ids. */
export function courierStatusLabel(status: string): string {
  return status in COURIER_STATUS_LABELS ? COURIER_STATUS_LABELS[status as CourierStatus]() : status;
}

export function courierVerificationLabel(verification: string): string {
  return verification in COURIER_VERIFICATION_LABELS ? COURIER_VERIFICATION_LABELS[verification as CourierVerification]() : verification;
}

export function vehicleLabel(vehicle: string): string {
  return vehicle in VEHICLE_LABELS ? VEHICLE_LABELS[vehicle as VehicleType]() : vehicle;
}

/** Fallback-tolerant labels for backend-supplied track filter ids. */
export function trackStatusLabel(status: string): string {
  return status in TRACK_STATUS_LABELS ? TRACK_STATUS_LABELS[status as CourierTrackStatus]() : status;
}

export function trackTypeLabel(type: string): string {
  return type in TYPE_SHORT_LABELS ? TYPE_SHORT_LABELS[type as DeliveryType]() : type;
}

/** Maps the backend filter ids to labeled options for the list toolbar. */
export function courierFilterOptions(filters: {statuses: string[]; verifications: string[]; vehicles: string[]}) {
  return {
    statusOptions: filters.statuses.map((id) => ({id, label: courierStatusLabel(id)})),
    verificationOptions: filters.verifications.map((id) => ({id, label: courierVerificationLabel(id)})),
    vehicleOptions: filters.vehicles.map((id) => ({id, label: vehicleLabel(id)})),
  };
}

/** Resolves stored reason codes to labels, falling back to the raw value for unknown backend values. */
export function suspendReasonLabel(reason: string): string {
  return reason in SUSPEND_REASON_LABELS ? SUSPEND_REASON_LABELS[reason as CourierSuspendReason]() : reason;
}

export function deleteReasonLabel(reason: string): string {
  return reason in DELETE_REASON_LABELS ? DELETE_REASON_LABELS[reason as CourierDeleteReason]() : reason;
}

export {formatJoined, formatJoinedLong} from "@/lib/format";
