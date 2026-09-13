import {HeroCtas} from "./HeroCtas";
import {IncognitoIcon} from "./IncognitoIcon";
import {Navbar} from "./Navbar";
import {ParcelIcon} from "./ParcelIcon";
import {QrCard} from "./QrCard";

import {heroContent} from "@/content/landing";

const headlineIcons = {
  parcel: ParcelIcon,
  incognito: IncognitoIcon,
} as const;

export function Hero() {
  return (
    <section aria-label="Hero" className="relative isolate flex min-h-155 flex-col overflow-clip bg-primary-700 sm:min-h-180 lg:h-225">
      <img alt="" aria-hidden="true" className="absolute inset-0 -z-10 size-full object-cover" src="/landing/hero/hero-bg.png" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-b from-black/30 via-black/45 to-black/85" />

      <Navbar />

      <div className="mx-auto flex w-full max-w-360 flex-1 flex-col justify-end px-6 pb-10 pt-28 sm:pb-14 md:px-10 lg:px-30 lg:pb-20">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <div className="flex max-w-160 flex-col items-start gap-6 drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)] sm:gap-8 lg:max-w-190 lg:drop-shadow-none">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2">
              <img alt="" aria-hidden="true" className="size-3.5" src="/landing/hero/safety.svg" />
              <span className="text-xs font-medium tracking-[0.02em] text-primary-500">{heroContent.badge}</span>
            </span>

            <h1 className="flex flex-col gap-1 text-[30px] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[40px] md:text-[48px] lg:gap-2 lg:text-[60px]">
              {heroContent.headlineLines.map((line) => (
                <span
                  key={line.map((segment) => segment.value).join(" ")}
                  className="inline-flex flex-wrap items-center gap-x-2.5 gap-y-1 lg:flex-nowrap lg:gap-x-3 lg:whitespace-nowrap"
                >
                  {line.map((segment) => {
                    if (segment.type === "icon") {
                      const Icon = headlineIcons[segment.value];
                      return (
                        <span key={segment.value} className="inline-flex origin-center scale-[0.62] sm:scale-75 lg:scale-100">
                          <Icon />
                        </span>
                      );
                    }
                    return <span key={segment.value}>{segment.value}</span>;
                  })}
                </span>
              ))}
            </h1>

            <p className="max-w-135.75 text-base leading-[1.4] tracking-[0.01em] text-white/85 sm:text-[18px]">{heroContent.subhead}</p>

            <HeroCtas />
          </div>

          <div className="shrink-0 lg:pb-1">
            <QrCard />
          </div>
        </div>
      </div>
    </section>
  );
}
