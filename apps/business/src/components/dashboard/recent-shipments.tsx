import {Link} from "@tanstack/react-router";
import {m} from "@/paraglide/messages";
import type {RecentShipment} from "@/types/dashboard-types";
import {EmptyShipments} from "./empty-shipments";
import {ShipmentsTable} from "./shipments-table";

/** "Recent shipments" header + either the table or the send-your-first-batch empty state. */
export function RecentShipments({shipments}: {shipments: RecentShipment[]}) {
  return (
    <section aria-labelledby="recent-shipments-heading" className="flex w-full flex-col">
      <div className="flex h-[52px] w-full items-center px-2 py-4">
        <div className="flex flex-1 items-center justify-between text-sm leading-[1.4] font-medium tracking-[0.14px] whitespace-nowrap">
          <h2 id="recent-shipments-heading" className="text-[#070d17]">
            {m["dashboard.recent_shipments"]()}
          </h2>
          <Link to="/shipments" className="text-primary-500 opacity-80 hover:opacity-100">
            {m["dashboard.view_all"]()}
          </Link>
        </div>
      </div>
      {shipments.length === 0 ? <EmptyShipments /> : <ShipmentsTable shipments={shipments} />}
    </section>
  );
}
