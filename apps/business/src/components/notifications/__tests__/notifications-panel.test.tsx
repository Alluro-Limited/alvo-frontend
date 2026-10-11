import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import type {ComponentProps} from "react";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {dashboardService} from "@/services/dashboard-service";
import type {AppNotification} from "@/types/dashboard-types";
import {NotificationsPanel} from "../notifications-panel";

vi.mock("@/services/dashboard-service", () => ({
  dashboardService: {getOverview: vi.fn(), getNotifications: vi.fn(), markAllNotificationsRead: vi.fn()},
}));

vi.mock("@alvo/ui", async (importOriginal) => {
  const mod = await importOriginal<typeof import("@alvo/ui")>();
  return {...mod, PopoverClose: (props: ComponentProps<"button">) => <button type="button" {...props} />};
});

const markAllRead = vi.mocked(dashboardService.markAllNotificationsRead);

const ITEMS: AppNotification[] = [
  {id: "n1", icon: "batch", title: "Batch created", body: "Labels ready.", time: "11:03 AM", day: "today", read: true},
  {id: "n2", icon: "package", title: "Packages picked up", body: "On the way.", time: "10:00 AM", day: "today", read: false},
  {id: "n3", icon: "wallet", title: "Wallet funded", body: "Credited.", time: "09:00 AM", day: "yesterday", read: false},
];

function renderPanel(notifications: AppNotification[], isLoading = false) {
  const queryClient = new QueryClient({defaultOptions: {queries: {retry: false}, mutations: {retry: false}}});
  return render(
    <QueryClientProvider client={queryClient}>
      <NotificationsPanel notifications={notifications} isLoading={isLoading} />
    </QueryClientProvider>
  );
}

describe("NotificationsPanel", () => {
  beforeEach(() => {
    markAllRead.mockReset();
    markAllRead.mockResolvedValue(undefined);
  });

  it("renders the bell-off empty state when there is nothing to show", () => {
    renderPanel([]);

    expect(screen.getByText("notifications.title")).toBeTruthy();
    expect(screen.getByText("notifications.empty_title")).toBeTruthy();
    expect(screen.getByText("notifications.empty_description")).toBeTruthy();
    expect((screen.getByRole("button", {name: /notifications.mark_all_read/}) as HTMLButtonElement).disabled).toBe(true);
  });

  it("renders skeleton rows while loading instead of the empty state", () => {
    renderPanel([], true);

    expect(screen.queryByText("notifications.empty_title")).toBeNull();
    expect(screen.queryByText("Batch created")).toBeNull();
  });

  it("groups rows under day dividers and enables mark-all-read when unread items exist", async () => {
    renderPanel(ITEMS);

    expect(screen.getByText("notifications.group_today")).toBeTruthy();
    expect(screen.getByText("notifications.group_yesterday")).toBeTruthy();
    expect(screen.getByText("Batch created")).toBeTruthy();
    expect(screen.getByText("Wallet funded")).toBeTruthy();
    const markAll = screen.getByRole("button", {name: /notifications.mark_all_read/}) as HTMLButtonElement;
    expect(markAll.disabled).toBe(false);

    fireEvent.click(markAll);
    await waitFor(() => expect(markAllRead).toHaveBeenCalledTimes(1));
  });

  it("keeps mark-all-read disabled once everything is read", () => {
    renderPanel(ITEMS.map((item) => ({...item, read: true})));

    const markAll = screen.getByRole("button", {name: /notifications.mark_all_read/}) as HTMLButtonElement;
    expect(markAll.disabled).toBe(true);
    fireEvent.click(markAll);
    expect(markAllRead).not.toHaveBeenCalled();
  });
});
