import {bulkCostOf, priceForShipment} from "@/lib/shipment-pricing";
import type {ShipmentService} from "@/types/shipment-types";
import {MOCK_AUTH} from "./mock-auth-service";
import {mockDelay, mockHttpError} from "./mock-http";
import {mockSession} from "./mock-session";

/** Destination lockers offered in the form's dropdown. */
const MOCK_LOCKERS = [
  {id: "locker-1", name: "Lekki Hub - PR14"},
  {id: "locker-2", name: "Surulere Hub - L04"},
  {id: "locker-3", name: "Apapa Port - L01"},
  {id: "locker-4", name: "Victoria Island - L02"},
  {id: "locker-5", name: "Ojota Terminal - L09"},
];

const PAYMENT_REQUIRED = 402;
let batchCounter = 20242;

/** In-memory stand-in for the backend while it does not exist. Never ships when `VITE_API_URL` is set. */
export const mockShipmentService: ShipmentService = {
  getLockers: async () => {
    await mockDelay();
    return MOCK_LOCKERS;
  },
  createBatch: async ({recipients, method, name}) => {
    await mockDelay();
    const totalPaid =
      name === undefined
        ? recipients.reduce((sum, recipient) => sum + priceForShipment(recipient.size, recipient.priority), 0)
        : bulkCostOf(recipients).total;
    if (method === "wallet") {
      const balance = mockSession.walletBalance ?? (mockSession.email === MOCK_AUTH.demoEmail ? 48500 : 0);
      if (balance < totalPaid) throw mockHttpError("shipments/batches", PAYMENT_REQUIRED);
      mockSession.walletBalance = balance - totalPaid;
    }
    batchCounter += 1;
    return {
      batchId: `${name === undefined ? "SH" : "BT"}-${batchCounter}`,
      shipmentCount: recipients.length,
      totalPaid,
      estimatedDelivery: "24–48h",
      receiptEmail: mockSession.email ?? "you@alvo.com",
    };
  },
};
