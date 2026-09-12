import {useState} from "react";

import {PrivacyReasonCard} from "./PrivacyReasonCard";

import {privacyContent} from "@/content/landing";

export function PrivacyReasons() {
  const [active, setActive] = useState(0);

  return (
    <div onMouseLeave={() => setActive(0)} className="flex w-full flex-col gap-4 lg:h-114.5 lg:flex-row lg:items-stretch lg:gap-6">
      <div className="overflow-hidden rounded-2xl bg-white lg:h-full lg:min-w-px lg:flex-1">
        <img alt={privacyContent.image.alt} className="h-60 w-full object-cover sm:h-80 lg:h-full" src={privacyContent.image.src} />
      </div>

      {privacyContent.reasons.map((reason, index) => (
        <PrivacyReasonCard key={reason.id} reason={reason} active={active === index} onActivate={() => setActive(index)} />
      ))}
    </div>
  );
}
