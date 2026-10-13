import {Checkbox} from "@alvo/ui";
import {PasswordField} from "@/components/auth/password-field";
import {m} from "@/paraglide/messages";

interface PasswordStepProps {
  password: string;
  agreed: boolean;
  onPassword: (value: string) => void;
  onAgree: (agreed: boolean) => void;
}

/** Step 3 — Create Password input plus the Terms/Privacy consent checkbox. */
export function PasswordStep({password, agreed, onPassword, onAgree}: PasswordStepProps) {
  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex w-full flex-col gap-2">
        <h2 className="text-[32px] font-bold leading-[1.1] tracking-[-0.32px] text-foreground">{m["su.pw_title"]()}</h2>
        <p className="text-[16px] leading-[1.4] tracking-[0.16px] text-grey-500">{m["su.pw_desc"]()}</p>
      </div>
      <div className="flex w-full flex-col gap-6">
        <PasswordField
          id="su-password"
          label={m["su.pw_label"]()}
          value={password}
          onChange={onPassword}
          placeholder={m["su.pw_ph"]()}
          autoComplete="new-password"
        />
        <div className="flex h-[22px] items-center gap-2">
          <Checkbox checked={agreed} onCheckedChange={(checked) => onAgree(checked === true)} aria-label={m["su.agree_label"]()} />
          <span className="text-[14px] leading-[1.4] tracking-[0.14px] text-primary-850">
            {m["su.agree_pre"]()} <span className="text-[12px] font-medium tracking-[0.12px] text-primary-500">{m["su.terms"]()}</span>{" "}
            {m["su.agree_mid"]()} <span className="text-[12px] font-medium tracking-[0.12px] text-primary-500">{m["su.privacy"]()}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
