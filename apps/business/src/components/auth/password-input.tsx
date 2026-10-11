import {useState} from "react";
import {Input, type InputProps} from "@alvo/ui";
import {Eye, EyeOff} from "lucide-react";
import {cn} from "cnfast";
import {m} from "@/paraglide/messages";

type PasswordInputProps = Omit<InputProps, "type">;

export function PasswordInput({className, ...props}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);
  const Icon = isVisible ? EyeOff : Eye;

  return (
    <div className="relative w-full">
      <Input {...props} type={isVisible ? "text" : "password"} className={cn("pr-12", className)} />
      <button
        type="button"
        onClick={() => setIsVisible((visible) => !visible)}
        aria-label={isVisible ? m["auth.hide_password"]() : m["auth.show_password"]()}
        className="absolute top-1/2 right-4 flex size-[22px] -translate-y-1/2 items-center justify-center rounded text-grey-500 outline-none transition-colors hover:text-grey-600 focus-visible:ring-2 focus-visible:ring-primary-500/50"
      >
        <Icon className="size-[22px]" strokeWidth={1.5} aria-hidden="true" />
      </button>
    </div>
  );
}
