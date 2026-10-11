import {useId} from "react";
import {Link} from "@tanstack/react-router";
import {m} from "@/paraglide/messages";
import {AuthSplitLayout} from "@/components/auth/auth-split-layout";
import {LoginForm} from "@/components/login/login-form";
import logoMarkUrl from "@/assets/logo-mark.svg";

export function LoginPage() {
  const titleId = useId();

  return (
    <AuthSplitLayout badge={m["login.badge"]()} headline={m["login.hero_title"]()} tagline={m["login.hero_tagline"]()}>
      <div className="flex w-full max-w-[448px] flex-col items-center gap-6">
        <div className="flex items-center gap-2">
          <img src={logoMarkUrl} alt="" className="h-6 w-[19px]" />
          <span className="text-xl leading-[1.2] font-medium whitespace-nowrap text-foreground">Alvo</span>
        </div>
        <section aria-labelledby={titleId} className="flex w-full flex-col items-center gap-4 rounded-2xl bg-background p-6 sm:p-10">
          <div className="flex w-full flex-col gap-8">
            <header className="flex flex-col items-center gap-1 text-center">
              <h1 id={titleId} className="text-xl leading-[1.2] font-medium text-foreground">
                {m["login.title"]()}
              </h1>
              <p className="text-base leading-[1.4] tracking-[0.01em] text-foreground/50">{m["login.description"]()}</p>
            </header>
            <LoginForm />
          </div>
          <p className="flex gap-1 text-sm leading-[1.4] tracking-[0.01em] whitespace-nowrap">
            <span className="text-foreground/50">{m["login.no_account"]()}</span>
            <Link to="/sign-up" className="font-medium text-primary-500 hover:underline">
              {m["login.create_account"]()}
            </Link>
          </p>
        </section>
      </div>
    </AuthSplitLayout>
  );
}
