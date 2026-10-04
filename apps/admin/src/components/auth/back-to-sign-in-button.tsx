import {Button} from "@alvo/ui";
import {Link} from "@tanstack/react-router";
import {m} from "@/paraglide/messages";

interface BackToSignInButtonProps {
  /** Result screens use it as their only action, so it becomes the primary button there. */
  primary?: boolean;
}

export function BackToSignInButton({primary = false}: BackToSignInButtonProps) {
  return (
    <Button
      render={<Link to="/" />}
      nativeButton={false}
      variant={primary ? "default" : "transparent"}
      className={primary ? "w-full text-base" : "w-full text-base text-primary-500 hover:bg-transparent hover:underline"}
    >
      {m["auth.back_to_sign_in"]()}
    </Button>
  );
}
