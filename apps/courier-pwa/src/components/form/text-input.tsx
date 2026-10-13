import type {ComponentProps} from "react";
import {cn} from "cnfast";
import {fieldClassName} from "./input-styles";

type TextInputProps = ComponentProps<"input">;

export function TextInput({className, ...props}: TextInputProps) {
  return <input {...props} className={cn(fieldClassName, className)} />;
}
