import {Circle, CircleCheck} from "lucide-react";
import {cn} from "cnfast";
import {m} from "@/paraglide/messages";
import {PASSWORD_RULES} from "./password-rules";

interface PasswordRequirementsProps {
  password: string;
}

/** Live checklist of the password policy; each rule ticks as soon as the new password satisfies it. */
export function PasswordRequirements({password}: PasswordRequirementsProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs leading-[1.4] tracking-[0.01em] text-grey-600">{m["reset_password.rules_title"]()}</p>
      <ul className="grid grid-cols-1 gap-x-4 gap-y-1.5 sm:grid-cols-2">
        {PASSWORD_RULES.map((rule) => {
          const isMet = rule.test(password);
          const Icon = isMet ? CircleCheck : Circle;
          return (
            <li
              key={rule.id}
              data-met={isMet}
              className={cn(
                "flex items-center gap-1.5 text-xs leading-[1.4] tracking-[0.01em]",
                isMet ? "text-status-success-dark" : "text-grey-600"
              )}
            >
              <Icon className={cn("size-3.5 shrink-0", isMet ? "text-status-success" : "text-grey-500")} aria-hidden="true" />
              {rule.label()}
              <span className="sr-only">{isMet ? m["reset_password.rule_met"]() : m["reset_password.rule_unmet"]()}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
