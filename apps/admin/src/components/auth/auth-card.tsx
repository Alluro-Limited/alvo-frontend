import {useId, type ReactNode} from "react";
import {cn} from "cnfast";
import {AuthLayout} from "./auth-layout";

interface AuthCardProps {
  title: string;
  description: ReactNode;
  /** Small label above the title, e.g. "Alvo Admin portal". */
  eyebrow?: string;
  /** Large status glyph shown above the header on result screens. */
  icon?: ReactNode;
  /** Result screens use a wider header so longer copy wraps like the Figma frames. */
  wideHeader?: boolean;
  children: ReactNode;
}

/** The white card on the auth backdrop shared by sign-in, forgot-password and reset-password. */
export function AuthCard({title, description, eyebrow, icon, wideHeader = false, children}: AuthCardProps) {
  const titleId = useId();

  return (
    <AuthLayout>
      <section
        aria-labelledby={titleId}
        className="flex w-full max-w-[500px] flex-col items-center gap-8 rounded-xl bg-background p-6 sm:p-8"
      >
        {icon}
        <header className={cn("flex flex-col items-center gap-4 text-center", wideHeader ? "max-w-[394px]" : "max-w-[323px]")}>
          {eyebrow && <p className="text-base leading-[1.4] font-medium tracking-[0.01em] text-foreground">{eyebrow}</p>}
          <div className="flex flex-col gap-[9px]">
            <h1 id={titleId} className="text-2xl leading-[1.2] font-bold tracking-[-0.01em] text-foreground">
              {title}
            </h1>
            <p className="text-base leading-[1.4] tracking-[0.01em] text-grey-600">{description}</p>
          </div>
        </header>
        {children}
      </section>
    </AuthLayout>
  );
}
