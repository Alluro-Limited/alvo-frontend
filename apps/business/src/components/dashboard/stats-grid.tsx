import type {DashboardStats} from "@/types/dashboard-types";
import {StatusStats} from "./status-stats";
import {VolumeStats} from "./volume-stats";

/** The two rows of four metric tiles; the whole grid is a tour spotlight target. */
export function StatsGrid({stats}: {stats: DashboardStats}) {
  return (
    <div data-tour="stats" className="grid w-full grid-cols-2 gap-4 xl:grid-cols-4">
      <VolumeStats stats={stats} />
      <StatusStats stats={stats} />
    </div>
  );
}
