import {DoorOpen, ShieldAlert, Wifi, Zap} from "lucide-react";
import {cn} from "cnfast";
import {m} from "@/paraglide/messages";
import type {NodeSensor, NodeSensorKey} from "@/types/nodes-types";

const ICONS: Record<NodeSensorKey, typeof Wifi> = {
  network: Wifi,
  power: Zap,
  door: DoorOpen,
  tamper: ShieldAlert,
};

/** The IoT sensors card — each reading comes straight from the backend payload. */
export function NodeSensors({sensors}: {sensors: NodeSensor[]}) {
  return (
    <section className="flex flex-col gap-4 rounded-lg border border-grey-200 bg-white p-6" aria-labelledby="node-sensors-title">
      <h2 id="node-sensors-title" className="text-base leading-[1.4] font-medium tracking-[0.16px] text-black">
        {m["nodes.sensors_title"]()}
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {sensors.map((sensor) => {
          const Icon = ICONS[sensor.key];
          return (
            <div key={sensor.key} className="flex items-center gap-3 rounded-lg border border-grey-200 p-3">
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-lg",
                  sensor.tone === "warn" ? "bg-status-fail-subtle text-status-fail-dark" : "bg-primary-50 text-primary-500"
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <div className="flex min-w-0 flex-col">
                <p className="truncate text-xs leading-[1.4] tracking-[0.12px] text-grey-500">{sensor.label}</p>
                <p className="truncate text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{sensor.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
