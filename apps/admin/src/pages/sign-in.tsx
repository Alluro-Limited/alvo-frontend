import {SignInForm} from "@/components/sign-in/sign-in-form";
import {SignInLayout} from "@/components/sign-in/sign-in-layout";
import {m} from "@/paraglide/messages";

export function SignInPage() {
  return (
    <SignInLayout>
      <section
        aria-labelledby="sign-in-title"
        className="flex w-full max-w-[500px] flex-col items-center gap-8 rounded-xl bg-background p-6 sm:p-8"
      >
        <header className="flex max-w-[323px] flex-col items-center gap-4 text-center">
          <p className="text-base leading-[1.4] font-medium tracking-[0.01em] text-foreground">{m["sign_in.portal"]()}</p>
          <div className="flex flex-col gap-[9px]">
            <h1 id="sign-in-title" className="text-2xl leading-[1.2] font-bold tracking-[-0.01em] text-foreground">
              {m["sign_in.title"]()}
            </h1>
            <p className="text-base leading-[1.4] tracking-[0.01em] text-grey-600">{m["sign_in.description"]()}</p>
          </div>
        </header>
        <SignInForm />
      </section>
    </SignInLayout>
  );
}
