import {m} from "@/paraglide/messages";
import type {UserActivity as UserActivityItem} from "@/types/users-types";

/** The "Recent activity" card — a teal-dot timeline of the user's latest events. */
export function UserActivity({items}: {items: UserActivityItem[]}) {
  return (
    <section className="rounded-lg bg-white p-4" aria-label={m["users.activity_title"]()}>
      <h3 className="text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{m["users.activity_title"]()}</h3>
      <ol className="flex flex-col pt-3">
        {items.map((item, index) => (
          <li key={item.id} className="relative flex gap-3 pb-5 last:pb-0">
            {index < items.length - 1 && <span className="absolute top-3 left-[5px] h-full w-0.5 bg-primary-500" aria-hidden="true" />}
            <span className="mt-1.5 size-3 shrink-0 rounded-full bg-primary-500" aria-hidden="true" />
            <div className="flex flex-col gap-0.5">
              <p className="text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{item.label}</p>
              <p className="text-xs leading-[1.4] tracking-[0.12px] text-grey-500">{item.at}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
