/** Centered step heading + description, shared by all three sign-up steps. */
export function StepHeader({title, description}: {title: string; description: string}) {
  return (
    <header className="flex flex-col items-center gap-1 text-center">
      <h1 className="text-2xl leading-[1.2] font-medium tracking-[-0.01em]">{title}</h1>
      <p className="text-base leading-[1.4] tracking-[0.01em] text-foreground/50">{description}</p>
    </header>
  );
}
