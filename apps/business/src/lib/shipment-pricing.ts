import type {ShipmentPriority, ShipmentSize} from "@/types/dashboard-types";

/**
 * Flat per-shipment prices in naira until the pricing API exists. Express adds a
 * fixed surcharge on top of the size band.
 */
const SIZE_PRICE: Record<ShipmentSize, number> = {S: 1870, M: 2900, B: 4200};
const EXPRESS_SURCHARGE = 1000;

export function priceForShipment(size: ShipmentSize, priority: ShipmentPriority) {
  return SIZE_PRICE[size] + (priority === "express" ? EXPRESS_SURCHARGE : 0);
}

/** Bulk batches are rated per shipment by priority only, plus a platform fee. */
export const BULK_RATE: Record<ShipmentPriority, number> = {standard: 500, express: 1000};
export const PLATFORM_FEE_RATE = 0.015;

export interface BulkCost {
  standardCount: number;
  expressCount: number;
  standardCost: number;
  expressCost: number;
  subtotal: number;
  platformFee: number;
  total: number;
}

export function bulkCostOf(recipients: {priority: ShipmentPriority}[]): BulkCost {
  const expressCount = recipients.filter((recipient) => recipient.priority === "express").length;
  const standardCount = recipients.length - expressCount;
  const standardCost = standardCount * BULK_RATE.standard;
  const expressCost = expressCount * BULK_RATE.express;
  const subtotal = standardCost + expressCost;
  const platformFee = Math.round(subtotal * PLATFORM_FEE_RATE);
  return {standardCount, expressCount, standardCost, expressCost, subtotal, platformFee, total: subtotal + platformFee};
}
