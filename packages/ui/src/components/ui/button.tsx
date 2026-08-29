import {Button as ButtonPrimitive} from "@base-ui/react/button";
import {cva, type VariantProps} from "class-variance-authority";
import type {ReactNode} from "react";

import {cn} from "cnfast";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:ring-2 focus-visible:ring-primary-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary-500 text-primary-foreground hover:bg-primary-600",
        outline: "border border-primary-500 bg-transparent text-primary-500 hover:bg-primary-50",
        transparent: "bg-transparent text-primary-900 hover:bg-primary-50",
        destructive: "bg-button-danger text-button-danger-foreground hover:bg-button-danger/80",
        disabled: "bg-button-disabled text-button-disabled-foreground",
        loading: "bg-primary-500 text-button-loading-foreground border-[1.5px] border-primary-500/30",
      },
      size: {
        default: "h-[50px] gap-2 px-5 py-3.5 text-[18px] tracking-[0.02em]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    startIcon?: ReactNode;
    isLoading?: boolean;
  };

function Button({className, variant = "default", size = "default", startIcon, isLoading, children, disabled, ...props}: ButtonProps) {
  const isDisabled = disabled || isLoading || variant === "disabled" || variant === "loading";
  const activeVariant = isLoading ? "loading" : variant;
  const label = isLoading ? "Loading..." : children;

  return (
    <ButtonPrimitive
      data-slot="button"
      disabled={isDisabled}
      className={cn(buttonVariants({variant: activeVariant, size, className}))}
      {...props}
    >
      {!isLoading && startIcon}
      {label}
    </ButtonPrimitive>
  );
}

export {Button};
