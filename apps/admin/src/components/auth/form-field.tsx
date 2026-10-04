import {useId, type ReactNode} from "react";
import {cn} from "cnfast";

export interface FormFieldControlProps {
  id: string;
  "aria-invalid": true | undefined;
  "aria-describedby": string | undefined;
}

interface FormFieldProps {
  label: string;
  error?: string;
  /** Grey helper text under the control; an error replaces it. */
  hint?: string;
  children: (control: FormFieldControlProps) => ReactNode;
}

/** Label, control and helper/error text, wired together for assistive tech via the props handed to `children`. */
export function FormField({label, error, hint, children}: FormFieldProps) {
  const id = useId();
  const messageId = `${id}-message`;
  const message = error ?? hint;

  return (
    <div className="flex w-full flex-col gap-2">
      <label htmlFor={id} className="text-base leading-[1.4] tracking-[0.01em] text-primary-800">
        {label}
      </label>
      <div className="flex flex-col gap-1">
        {children({id, "aria-invalid": error ? true : undefined, "aria-describedby": message ? messageId : undefined})}
        {message && (
          <p id={messageId} className={cn("text-xs leading-[1.4] tracking-[0.01em]", error ? "text-status-fail" : "text-grey-500")}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
