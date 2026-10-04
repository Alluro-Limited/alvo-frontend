import {useId, type ReactNode} from "react";

export interface FormFieldControlProps {
  id: string;
  "aria-invalid": true | undefined;
  "aria-describedby": string | undefined;
}

interface FormFieldProps {
  label: string;
  error?: string;
  children: (control: FormFieldControlProps) => ReactNode;
}

/** Label, control and inline error, wired together for assistive tech via the props handed to `children`. */
export function FormField({label, error, children}: FormFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className="flex w-full flex-col gap-2">
      <label htmlFor={id} className="text-base leading-[1.4] tracking-[0.01em] text-primary-800 dark:text-primary-200">
        {label}
      </label>
      <div className="flex flex-col gap-1">
        {children({id, "aria-invalid": error ? true : undefined, "aria-describedby": error ? errorId : undefined})}
        {error && (
          <p id={errorId} className="text-xs leading-[1.4] tracking-[0.01em] text-status-fail">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
