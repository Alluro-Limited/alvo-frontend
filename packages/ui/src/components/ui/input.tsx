import {Input as InputPrimitive} from "@base-ui/react/input";

import {cn} from "cnfast";

type InputProps = React.ComponentProps<typeof InputPrimitive>;

function Input({className, ...props}: InputProps) {
  return (
    <InputPrimitive
      data-slot="input"
      className={cn(
        "flex h-[50px] w-full rounded-lg border border-grey-300 bg-background px-4 text-base text-foreground outline-none transition-all placeholder:text-grey-600 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/50 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-500 aria-[invalid=true]:border-status-fail aria-[invalid=true]:focus:ring-status-fail/50",
        className
      )}
      {...props}
    />
  );
}

export {Input};
export type {InputProps};
