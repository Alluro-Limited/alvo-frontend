import {navContent} from "@/content/landing";

export function NavDownloadLink({className = ""}: {className?: string}) {
  return (
    <a
      href={navContent.downloadHref}
      className={`flex h-[54px] items-center justify-center gap-2 bg-primary-500 px-6 text-white transition-colors hover:bg-primary-600 ${className}`}
    >
      <img alt="" aria-hidden="true" className="size-6" src="/landing/nav/arrow-down.svg" />
      <span className="text-base font-medium tracking-[0.01em]">{navContent.cta}</span>
    </a>
  );
}
