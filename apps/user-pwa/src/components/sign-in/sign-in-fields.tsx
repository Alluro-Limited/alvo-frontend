import {Link} from "@tanstack/react-router";
import {AuthField} from "@/components/auth/auth-field";
import {PasswordField} from "@/components/auth/password-field";
import {m} from "@/paraglide/messages";

interface SignInFieldsProps {
  email: string;
  password: string;
  error: boolean;
  onEmail: (value: string) => void;
  onPassword: (value: string) => void;
}

/** Email + password inputs with the right-aligned "Forgot Password?" link. */
export function SignInFields({email, password, error, onEmail, onPassword}: SignInFieldsProps) {
  return (
    <div className="flex w-full flex-col items-end gap-3">
      <div className="flex w-full flex-col gap-6">
        <AuthField
          id="si-email"
          label={m["su.email"]()}
          type="email"
          value={email}
          onChange={onEmail}
          placeholder={m["su.email_ph"]()}
          autoComplete="email"
          error={error}
        />
        <PasswordField
          id="si-password"
          label={m["si.password_label"]()}
          value={password}
          onChange={onPassword}
          placeholder={m["si.password_ph"]()}
          error={error}
        />
      </div>
      <Link to="/reset-password" className="text-[14px] font-medium leading-[1.4] tracking-[0.14px] text-primary-500">
        {m["si.forgot"]()}
      </Link>
    </div>
  );
}
