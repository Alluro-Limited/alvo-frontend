import {useNavigate} from "@tanstack/react-router";
import {CheckSquare, Phone, Search} from "lucide-react";
import submittedIcon from "@/assets/request-submitted.svg";
import {m} from "@/paraglide/messages";

const STEPS = [
  {icon: Search, key: "bankd.s1"},
  {icon: Phone, key: "bankd.s2"},
  {icon: CheckSquare, key: "bankd.s3"},
] as const;

/** Post-submit state for the bank change request — badge, copy, next-steps card, Back to Profile. */
export function BankSubmitted() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 flex-col">
      <div className="mt-6 flex flex-col items-center gap-8">
        <span className="grid size-16 place-items-center rounded-full bg-grey-100">
          <img src={submittedIcon} alt="" className="size-14" />
        </span>
        <div className="text-center">
          <h2 className="text-[32px] leading-[36px] font-bold tracking-[-0.01em]">{m["bankd.title"]()}</h2>
          <p className="mt-2 text-[14px] leading-[20px] text-grey-500">{m["bankd.desc"]()}</p>
        </div>
      </div>
      <section className="mt-8 rounded-[8px] bg-[#f9f9f9] p-2">
        <div className="flex flex-col gap-3">
          <h3 className="text-[14px] font-medium">{m["bankd.next"]()}</h3>
          <ul className="flex flex-col gap-2">
            {STEPS.map(({icon: Icon, key}) => (
              <li key={key} className="flex items-start gap-2 text-[12px] text-[#070d17]/60">
                <Icon className="mt-0.5 size-3 shrink-0" aria-hidden="true" />
                {m[key]()}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <button
        type="button"
        onClick={() => void navigate({to: "/profile"})}
        className="mt-auto mb-2 h-[50px] w-full rounded-[8px] bg-primary-500 text-[16px] font-medium text-white"
      >
        {m["bankd.back"]()}
      </button>
    </div>
  );
}
