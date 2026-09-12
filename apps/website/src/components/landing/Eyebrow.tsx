export function Eyebrow({label}: {label: string}) {
  return (
    <span className="inline-flex items-center gap-2 px-1">
      <span className="size-[7px] rounded-full bg-primary-500 ring-4 ring-primary-500/20" />
      <span className="text-xs font-medium tracking-[0.01em] text-primary-500">{label}</span>
    </span>
  );
}
