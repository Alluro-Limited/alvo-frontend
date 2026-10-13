import {useNavigate} from "@tanstack/react-router";
import {StatusPill} from "./status-pill";
import type {ActivityItem} from "@/types/activity-types";
import type {SimpleMessage} from "@/lib/i18n";
import {naira} from "@/lib/money";
import {m} from "@/paraglide/messages";
import packageIconUrl from "@/assets/icon-package2.svg";
import safeIconUrl from "@/assets/icon-safe-line.svg";
import truckIconUrl from "@/assets/icon-truck.svg";

const KIND_ICONS: Record<ActivityItem["kind"], {src: string; bg: string}> = {
  package: {src: packageIconUrl, bg: "bg-[#e9fafb]"},
  safe: {src: safeIconUrl, bg: "bg-[#f3effe]"},
};

/** In-transit packages swap the box icon for the truck artwork. */
const TRUCK_STATUSES = new Set(["dropped", "enroute", "delayed"]);
/** Terminal states whose card action is "Contact support". */
const SUPPORT_STATUSES = new Set(["complete", "collected"]);

interface ActivityCardProps {
  item: ActivityItem;
  /** Opens the locker-upgrade sheet — only wired for `pending` items. */
  onUpgrade: (item: ActivityItem) => void;
}

/** One activity card — kind icon, ID + status pill, recipient + amount, ETA, and a status-aware action. */
export function ActivityCard({item, onUpgrade}: ActivityCardProps) {
  const navigate = useNavigate();
  const icon = TRUCK_STATUSES.has(item.status) ? {src: truckIconUrl, bg: "bg-[#fef6e7]"} : KIND_ICONS[item.kind];
  const isSafe = item.kind === "safe";
  const idLabel = isSafe ? m["act.safe_id"]() : m["act.pkg_id"]();
  const midLabel = isSafe ? m["act.location"]() : m["act.recipient"]();
  const botLabel = isSafe ? m["act.expires"]() : m["act.eta"]();
  const action: {label: SimpleMessage; onClick: () => void} =
    item.status === "pending"
      ? {label: "act.change_size", onClick: () => onUpgrade(item)}
      : SUPPORT_STATUSES.has(item.status)
        ? {label: "act.contact_support", onClick: () => void navigate({to: "/support"})}
        : {label: "act.view_details", onClick: () => void navigate({to: "/delivery/$id", params: {id: item.id}})};

  return (
    <article className="flex w-full gap-3 border-b-[0.5px] border-grey-300 py-4 last:border-b-0">
      <span className={`flex size-[52px] shrink-0 items-center justify-center rounded-[8px] ${icon.bg}`}>
        <img src={icon.src} alt="" aria-hidden="true" className="size-6" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <CardRows item={item} idLabel={idLabel} midLabel={midLabel} botLabel={botLabel} />
        <button
          type="button"
          onClick={action.onClick}
          className="flex h-[50px] w-full items-center justify-center rounded-[8px] bg-[#f2f2f2] text-[14px] font-medium leading-[1.4] tracking-[0.28px] text-[#00221e]"
        >
          {m[action.label]()}
        </button>
      </div>
    </article>
  );
}

/** The three label/value rows — ID + pill, mid label + amount, bottom label + time. */
function CardRows({item, idLabel, midLabel, botLabel}: {item: ActivityItem; idLabel: string; midLabel: string; botLabel: string}) {
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex w-full items-center justify-between">
        <span className="flex items-center gap-0.5 text-[14px] leading-[1.4]">
          <span className="text-grey-600">{idLabel}</span>
          <span className="font-medium text-foreground">{`#${item.refId}`}</span>
        </span>
        <StatusPill status={item.status} kind={item.kind} />
      </div>
      <div className="flex w-full items-center justify-between">
        <span className="flex items-center gap-0.5 text-[14px] leading-[1.4]">
          <span className="text-grey-600">{midLabel}</span>
          <span className="text-foreground">{item.recipient}</span>
        </span>
        <span className="text-[14px] font-medium leading-[1.4] text-[#00443c]">{naira(item.amount)}</span>
      </div>
      <span className="flex w-full items-center gap-1 text-[14px] leading-[1.4]">
        <span className="text-grey-600">{botLabel}</span>
        <span className="font-medium text-primary-500">{item.eta}</span>
      </span>
    </div>
  );
}
