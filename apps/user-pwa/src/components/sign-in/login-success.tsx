import {useNavigate} from "@tanstack/react-router";
import {Button} from "@alvo/ui";
import {SuccessScreen} from "@/components/auth/success-screen";
import {m} from "@/paraglide/messages";

/** "Login Successful!" — greets the returned name and offers the single "Get Started" action. */
export function LoginSuccess({name}: {name: string}) {
  const navigate = useNavigate();

  return (
    <SuccessScreen
      title={m["si.success"]()}
      description={
        <>
          {m["si.success_pre"]()} <span className="font-bold text-primary-500">{name}</span>
          {m["si.success_post"]()}
        </>
      }
    >
      <Button className="w-full text-[16px] font-medium" onClick={() => void navigate({to: "/home"})}>
        {m["si.get_started"]()}
      </Button>
    </SuccessScreen>
  );
}
