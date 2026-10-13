import {Link} from "@tanstack/react-router";
import {ChevronRight} from "lucide-react";
import jobLogo from "@/assets/job-logo.png";
import {m} from "@/paraglide/messages";

/** The "Job — explore jobs outside your area" link row between the header and the sections. */
export function ExploreJobsCard() {
  return (
    <Link to="/jobs" className="flex items-center gap-3 rounded-[12px] bg-grey-100 px-3 py-3">
      <img src={jobLogo} alt="" className="size-10 rounded-full" />
      <span className="flex-1">
        <span className="block text-[15px] font-semibold">{m["home.jobs"]()}</span>
        <span className="block text-[13px] text-grey-500">{m["home.explore"]()}</span>
      </span>
      <ChevronRight className="size-5 text-primary-500" aria-hidden="true" />
    </Link>
  );
}
