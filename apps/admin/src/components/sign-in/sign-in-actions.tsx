import {Button} from "@alvo/ui";
import {Link} from "@tanstack/react-router";
import {m} from "@/paraglide/messages";

interface SignInActionsProps {
  isPending: boolean;
  isLocked: boolean;
}

export function SignInActions({isPending, isLocked}: SignInActionsProps) {
  return (
    <div className="flex flex-col gap-4">
      <Button type="submit" isLoading={isPending} disabled={isLocked} className="w-full text-base">
        {isPending ? m["sign_in.submitting"]() : m["sign_in.submit"]()}
      </Button>
      <Button
        render={<Link to="/forgot-password" />}
        nativeButton={false}
        variant="transparent"
        className="w-full text-base text-primary-500 hover:bg-transparent hover:underline"
      >
        {m["sign_in.forgot_password"]()}
      </Button>
    </div>
  );
}
