import megaphoneUrl from "@/assets/icon-megaphone.svg";
import packageIconUrl from "@/assets/icon-package2.svg";
import safeIconUrl from "@/assets/icon-safe-line.svg";
import type {NotificationKind} from "@/types/notification-types";

const ICONS: Record<NotificationKind, string> = {
  delivery: packageIconUrl,
  payment: safeIconUrl,
  announcement: megaphoneUrl,
};

/** The 24px per-kind icon at the left of a notification row. */
export function NotifIcon({kind}: {kind: NotificationKind}) {
  return <img src={ICONS[kind]} alt="" aria-hidden="true" className="size-6 shrink-0" />;
}
