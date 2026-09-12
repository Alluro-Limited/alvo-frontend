import {privacyContent} from "@/content/landing";

type Reason = (typeof privacyContent.reasons)[number];

export function PrivacyReasonCard({reason, active, onActivate}: {reason: Reason; active: boolean; onActivate: () => void}) {
  return (
    <div
      onMouseEnter={onActivate}
      className={`flex shrink-0 flex-col justify-between overflow-hidden rounded-2xl bg-grey-100 p-6 transition-all duration-500 ease-out lg:h-full lg:py-8 ${
        active ? "lg:w-[482px] lg:px-8" : "lg:w-[84px] lg:px-4"
      }`}
    >
      <span className="flex size-[50px] shrink-0 items-center justify-center rounded-lg border-[0.5px] border-grey-200 bg-white">
        <img alt="" aria-hidden="true" className="size-6" src={reason.icon} />
      </span>

      <div
        className={`mt-6 flex shrink-0 flex-col gap-3 transition-opacity duration-300 lg:mt-0 lg:w-[418px] ${
          active ? "lg:opacity-100" : "lg:opacity-0"
        }`}
      >
        <h3 className="text-2xl font-medium leading-[1.2] tracking-[-0.01em] text-black">{reason.title}</h3>
        <p className="text-base leading-6 tracking-[0.01em] text-grey-600">{reason.description}</p>
        <div className="mt-1 flex flex-wrap gap-[7px]">
          {reason.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-white px-[11px] py-[5px] text-xs font-medium tracking-[0.01em] text-primary-500">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
