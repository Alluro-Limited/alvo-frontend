import type {CourierNotification, NotificationsService} from "@/types/deliveries-types";
import {mockDelay} from "./mock-http";

/** The notification feed from the Figma — Today / Yesterday / dated groups. */
const NOTIFICATIONS: CourierNotification[] = [
  {
    id: "n1",
    category: "delivery",
    icon: "completed",
    title: "Delivery Completed",
    body: "Great work! Job PRI-4710 has been marked as completed. Your earnings have been updated.",
    time: "11:03 AM",
    dayLabel: "Today",
    unread: true,
  },
  {
    id: "n2",
    category: "delivery",
    icon: "assigned",
    title: "Delivery Assignment Waiting",
    body: "New regular delivery PRI-4729 has been assigned to you. Accept before the timer runs out or it moves to the next courier.",
    time: "11:03 AM",
    dayLabel: "Today",
    unread: true,
  },
  {
    id: "n3",
    category: "delivery",
    icon: "speed",
    title: "Speed Delivery Assigned to You",
    body: "SPD-472 has been auto-assigned to your route. You have 30 seconds to accept before it's reassigned.",
    time: "11:03 AM",
    dayLabel: "Today",
    unread: false,
  },
  {
    id: "n4",
    category: "earning",
    icon: "earning",
    title: "Earnings Credited",
    body: "₦3,200 has been added to your wallet for completing PRI-4729. Total balance: ₦48,500.",
    time: "11:03 AM",
    dayLabel: "Yesterday",
    unread: true,
  },
  {
    id: "n5",
    category: "delivery",
    icon: "completed",
    title: "Delivery Completed",
    body: "Great work! Job PRI-4710 has been marked as completed. Your earnings have been updated.",
    time: "11:03 AM",
    dayLabel: "Yesterday",
    unread: true,
  },
  {
    id: "n6",
    category: "delivery",
    icon: "assigned",
    title: "Delivery Assignment Waiting",
    body: "New regular delivery PRI-4729 has been assigned to you. Accept before the timer runs out or it moves to the next courier.",
    time: "11:03 AM",
    dayLabel: "Yesterday",
    unread: false,
  },
  {
    id: "n7",
    category: "delivery",
    icon: "assigned",
    title: "Delivery Assignment Waiting",
    body: "New regular delivery PRI-4729 has been assigned to you. Accept before the timer runs out or it moves to the next courier.",
    time: "11:03 AM",
    dayLabel: "25/02/2026",
    unread: false,
  },
];

/** In-memory stand-in for the backend while it does not exist. Never ships when `VITE_API_URL` is set. */
export const mockNotificationsService: NotificationsService = {
  getNotifications: async () => {
    await mockDelay(300);
    return [...NOTIFICATIONS];
  },
};
