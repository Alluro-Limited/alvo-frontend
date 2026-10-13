import {useId, type ReactNode} from "react";

export interface FieldControlProps {
  id: string;
  "aria-invalid": true | undefined;
  "aria-describedby": string | undefined;
}

interface FormFieldProps {
  label: string;
  /** Message key rendered in red under the control when set. */
  error?: string;
  children: (control: FieldControlProps) => ReactNode;
}

/** Label, control and error text, wired together for assistive tech via the props handed to `children`. */
export function FormField({label, error, children}: FormFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className="flex w-full flex-col gap-2">
      <label htmlFor={id} className="text-[14px] leading-[22px] font-medium text-foreground">
        {label}
      </label>
      <div className="flex flex-col gap-1.5">
        {children({id, "aria-invalid": error ? true : undefined, "aria-describedby": error ? errorId : undefined})}
        {error && (
          <p id={errorId} className="text-[13px] leading-[17px] text-danger-500">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
