import {Check, X} from "lucide-react";
import {cn} from "cnfast";
import {m} from "@/paraglide/messages";
import {PASSWORD_RULES} from "./password-rules";

interface PasswordRequirementsProps {
  password: string;
}

/** Figma "State=None/Full" chips: outlined with a cross until the rule passes, then filled teal with a tick. */
export function PasswordRequirements({password}: PasswordRequirementsProps) {
  return (
    <ul className="flex flex-wrap gap-2">
      {PASSWORD_RULES.map((rule) => {
        const isMet = rule.test(password);
        const Icon = isMet ? Check : X;
        return (
          <li
            key={rule.id}
            data-met={isMet}
            className={cn(
              "flex h-[30px] items-center gap-1 rounded-full px-2.5 text-sm leading-[1.4] tracking-[0.01em] transition-colors",
              isMet ? "bg-primary-500 text-cream" : "border-[0.5px] border-grey-500 bg-cream text-grey-500"
            )}
          >
            <Icon className="size-3.5 shrink-0" aria-hidden="true" />
            {rule.label()}
            <span className="sr-only">{isMet ? m["reset_password.rule_met"]() : m["reset_password.rule_unmet"]()}</span>
          </li>
        );
      })}
    </ul>
  );
}
