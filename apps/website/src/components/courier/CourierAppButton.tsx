export function CourierAppButton({label, href, className = ""}: {label: string; href: string; className?: string}) {
  return (
    <a
      href={href}
      className={`inline-flex h-12 w-fit items-center justify-center gap-2 rounded-lg bg-primary-500 px-5 text-base font-medium tracking-[0.02em] whitespace-nowrap text-white transition-colors hover:bg-primary-600 ${className}`}
    >
      <span className="inline-flex items-center gap-1">
        <img alt="" aria-hidden="true" className="size-5" src="/courier/icon-gplay-white.svg" />
        <span className="h-5 w-px bg-white/30" />
        <img alt="" aria-hidden="true" className="size-5" src="/courier/icon-appstore-white.svg" />
      </span>
      {label}
    </a>
  );
}
