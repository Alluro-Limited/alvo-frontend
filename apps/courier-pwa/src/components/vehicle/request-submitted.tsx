import {useNavigate} from "@tanstack/react-router";
import {CalendarDays, CheckSquare, Phone, Search} from "lucide-react";
import submittedIcon from "@/assets/request-submitted.svg";
import {m} from "@/paraglide/messages";
import type {VehicleType} from "@/types/earnings-types";

interface RequestSubmittedProps {
  vehicle: VehicleType;
}

const STEPS = [
  {icon: Phone, key: "vehd.s1"},
  {icon: CalendarDays, key: "vehd.s2"},
  {icon: Search, key: "vehd.s3"},
  {icon: CheckSquare, key: "vehd.s4"},
] as const;

/** The post-submit state: badge, confirmation copy, "What happens next?" card, Back to Profile. */
export function RequestSubmitted({vehicle}: RequestSubmittedProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col items-center gap-8">
        <span className="grid size-16 place-items-center rounded-full bg-grey-100">
          <img src={submittedIcon} alt="" className="size-14" />
        </span>
        <div className="text-center">
          <h2 className="text-[32px] leading-[36px] font-bold tracking-[-0.01em]">{m["vehd.title"]()}</h2>
          <p className="mt-2 text-[14px] leading-[20px] text-grey-500">{m["vehd.desc"]({vehicle: m[`veh.${vehicle}`]()})}</p>
        </div>
      </div>
      <section className="mt-8 rounded-[8px] bg-[#f9f9f9] p-4">
        <h3 className="text-[14px] font-medium">{m["vehd.next"]()}</h3>
        <ul className="mt-4 flex flex-col gap-3">
          {STEPS.map(({icon: Icon, key}) => (
            <li key={key} className="flex items-center gap-2 text-[12px] text-[#070d17]/60">
              <Icon className="size-3 shrink-0" aria-hidden="true" />
              {m[key]()}
            </li>
          ))}
        </ul>
      </section>
      <button
        type="button"
        onClick={() => void navigate({to: "/profile"})}
        className="mt-auto mb-2 h-[50px] w-full rounded-[8px] bg-primary-500 text-[16px] font-medium text-white"
      >
        {m["vehd.back"]()}
      </button>
    </div>
  );
}
