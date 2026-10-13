import type {ComponentProps} from "react";
import {ChevronDown} from "lucide-react";
import {cn} from "cnfast";
import {fieldClassName} from "./input-styles";

type SelectInputProps = ComponentProps<"select">;

/** Native select styled like `TextInput`, with the design's right-side chevron. */
export function SelectInput({className, children, ...props}: SelectInputProps) {
  return (
    <div className="relative w-full">
      <select {...props} className={cn(fieldClassName, "appearance-none pr-10", props.value === "" && "text-grey-500", className)}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-foreground" aria-hidden="true" />
    </div>
  );
}
