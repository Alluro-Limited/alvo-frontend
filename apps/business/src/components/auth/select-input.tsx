import type {ComponentProps} from "react";
import {ChevronDown} from "lucide-react";

import {authInputClassName} from "./auth-input-styles";
import {cn} from "cnfast";

type SelectInputProps = ComponentProps<"select">;

/**
 * Native select styled to match the auth `Input`: same height, border and focus ring,
 * with a chevron on the right like the Figma dropdown control.
 */
export function SelectInput({className, children, ...props}: SelectInputProps) {
  return (
    <div className="relative w-full">
      <select {...props} className={cn(authInputClassName, "appearance-none pr-12", className)}>
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-foreground"
        strokeWidth={1.5}
        aria-hidden="true"
      />
    </div>
  );
}
