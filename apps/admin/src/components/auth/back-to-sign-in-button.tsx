import type {ReactNode} from "react";
import {Button} from "@alvo/ui";
import {Link} from "@tanstack/react-router";
import {m} from "@/paraglide/messages";

const variants = {
  /** Solid teal: the only action on a result screen. */
  primary: {variant: "default", className: "w-full text-base"},
  /** Teal text link under a form's main action. */
  link: {variant: "transparent", className: "w-full text-base text-primary-500 hover:bg-transparent hover:underline"},
  /** Dark text link, used where the screen's accent is a warning. */
  subtle: {variant: "transparent", className: "w-full text-base hover:bg-transparent hover:underline"},
} as const;

interface BackToSignInButtonProps {
  variant?: keyof typeof variants;
  /** Defaults to "Back to sign in". */
  children?: ReactNode;
}

export function BackToSignInButton({variant = "link", children}: BackToSignInButtonProps) {
  const style = variants[variant];
  return (
    <Button render={<Link to="/" />} nativeButton={false} variant={style.variant} className={style.className}>
      {children ?? m["auth.back_to_sign_in"]()}
    </Button>
  );
}
