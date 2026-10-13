import type {ActivityService} from "@/types/activity-types";
import {DETAILS, ITEMS} from "./mock-activity-data";
import {mockDelay, mockHttpError} from "./mock-http";

export const mockActivityService: ActivityService = {
  getActivities: async () => {
    await mockDelay();
    return ITEMS;
  },
  getDelivery: async (id) => {
    await mockDelay();
    const detail = DETAILS[id];
    if (!detail) throw mockHttpError(`deliveries/${id}`, 404, {code: "not_found"});
    return detail;
  },
  previewDropoffExtension: async (id, hours) => {
    await mockDelay();
    const detail = DETAILS[id];
    if (!detail) throw mockHttpError(`deliveries/${id}/extend/preview`, 404, {code: "not_found"});
    return {addedTime: `+${hours} Hours`, newDeadline: "Today, 2:34 PM", fee: detail.kind === "safe" ? 700 : 0};
  },
  extendDropoff: async (id, _hours) => {
    await mockDelay();
    if (!DETAILS[id]) throw mockHttpError(`deliveries/${id}/extend`, 404, {code: "not_found"});
    return {newDeadline: "Today, 5:45 PM", lockerNode: "Ikeja City Center", status: "Access Code Reactivated"};
  },
  previewPickupExtension: async (id, hours) => {
    await mockDelay();
    const detail = DETAILS[id];
    if (!detail) throw mockHttpError(`deliveries/${id}/pickup/extend/preview`, 404, {code: "not_found"});
    return {addedTime: `+${hours} Hours`, newDeadline: "Tomorrow, Jan 7, 11:34 AM", fee: detail.pickupExtensionFee};
  },
  reactivatePickup: async (id, _hours, _channel) => {
    await mockDelay();
    const detail = DETAILS[id];
    if (!detail) throw mockHttpError(`deliveries/${id}/pickup/reactivate`, 404, {code: "not_found"});
    return {newDeadline: "Tomorrow, Jan 7, 11:34 AM", lockerNode: detail.pickupLocation.node, status: "Access Code Reactivated"};
  },
  upgradeLocker: async (id, _channel) => {
    await mockDelay();
    const detail = DETAILS[id];
    if (!detail?.lockerUpgrade) throw mockHttpError(`deliveries/${id}/upgrade`, 404, {code: "not_found"});
    detail.info.size = detail.lockerUpgrade.newSize;
    detail.lockerUpgrade = null;
    detail.status = "booked";
    const item = ITEMS.find((i) => i.id === id);
    if (item) item.status = "booked";
  },
  cancelShipment: async (id) => {
    await mockDelay();
    const detail = DETAILS[id];
    if (!detail) throw mockHttpError(`deliveries/${id}/cancel`, 404, {code: "not_found"});
    detail.status = "cancelled";
    const item = ITEMS.find((i) => i.id === id);
    if (item) item.status = "cancelled";
  },
  sendPickupVerification: async (id) => {
    await mockDelay();
    if (!DETAILS[id]) throw mockHttpError(`deliveries/${id}/pickup/verify/send`, 404, {code: "not_found"});
  },
  verifyPickup: async (id, code) => {
    await mockDelay();
    const detail = DETAILS[id];
    if (!detail) throw mockHttpError(`deliveries/${id}/pickup/verify`, 404, {code: "not_found"});
    if (code !== "555555") throw mockHttpError(`deliveries/${id}/pickup/verify`, 400, {code: "invalid_code"});
    if (detail.pickupAccess) detail.pickupAccess.protected = false;
  },
};
