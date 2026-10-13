import {useState} from "react";
import {Eye, EyeOff} from "lucide-react";
import {AuthField} from "./auth-field";
import {m} from "@/paraglide/messages";

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: boolean;
  autoComplete?: string;
}

/** Password input with the design's eye toggle on the right. */
export function PasswordField({id, label, value, onChange, placeholder, error, autoComplete = "current-password"}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <AuthField
      id={id}
      label={label}
      type={visible ? "text" : "password"}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      error={error}
      autoComplete={autoComplete}
      suffix={
        <button
          type="button"
          aria-label={visible ? m["auth.hide_password"]() : m["auth.show_password"]()}
          aria-pressed={visible}
          onClick={() => setVisible((v) => !v)}
          className="flex size-[22px] shrink-0 items-center justify-center text-grey-500"
        >
          {visible ? <EyeOff className="size-[22px]" aria-hidden="true" /> : <Eye className="size-[22px]" aria-hidden="true" />}
        </button>
      }
    />
  );
}
