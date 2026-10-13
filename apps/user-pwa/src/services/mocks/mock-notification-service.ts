import type {NotificationGroup, UserNotificationService} from "@/types/notification-types";
import {mockDelay} from "./mock-http";

/** The designed feed: deliveries today/yesterday, a storage expiry, and a service announcement. */
const GROUPS: NotificationGroup[] = [
  {
    label: "Today",
    items: [
      {
        id: "n1",
        kind: "delivery",
        title: "Parcel Received",
        time: "11:03 AM",
        body: "Great news! Your recipient has successfully picked up the parcel from the locker.",
      },
      {
        id: "n2",
        kind: "delivery",
        title: "On Its Way",
        time: "10:44 AM",
        body: "Your parcel has been picked up by the courier and is heading to the destination.",
      },
      {
        id: "n3",
        kind: "delivery",
        title: "Parcel Dropped Off",
        time: "10:23 AM",
        body: "Your parcel is securely locked in P-IK123 and ready for transit.",
      },
    ],
  },
  {
    label: "Yesterday",
    items: [
      {
        id: "n4",
        kind: "delivery",
        title: "Storage Expiring Soon",
        time: "10:23 AM",
        body: "Your safe rental expires in 15 minutes. Would you like to extend your time?",
      },
    ],
  },
  {
    label: "17/12/2025",
    items: [
      {
        id: "n5",
        kind: "announcement",
        title: "We’ve Arrived in Abuja!",
        time: "10:23 AM",
        body: "Good news! New Alvo lockers are now active in Gwagwalada.",
      },
    ],
  },
];

/** In-memory stand-in for the backend while it does not exist. Never ships when `VITE_API_URL` is set. */
export const mockNotificationService: UserNotificationService = {
  getNotifications: async () => {
    await mockDelay();
    return GROUPS;
  },
};
