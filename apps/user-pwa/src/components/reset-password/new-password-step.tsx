import {PasswordField} from "@/components/auth/password-field";
import {m} from "@/paraglide/messages";

interface NewPasswordStepProps {
  password: string;
  onPassword: (value: string) => void;
}

/** Reset step 3 — "Create New Password" with a single password input. */
export function NewPasswordStep({password, onPassword}: NewPasswordStepProps) {
  return (
    <>
      <div className="flex w-full flex-col gap-2">
        <h1 className="text-[32px] font-bold leading-[1.1] tracking-[-0.32px] text-foreground">{m["rp.new_title"]()}</h1>
        <p className="text-[16px] leading-[1.4] tracking-[0.16px] text-grey-500">{m["rp.new_desc"]()}</p>
      </div>
      <PasswordField
        id="rp-password"
        label={m["rp.new_label"]()}
        value={password}
        onChange={onPassword}
        placeholder={m["rp.new_ph"]()}
        autoComplete="new-password"
      />
    </>
  );
}
