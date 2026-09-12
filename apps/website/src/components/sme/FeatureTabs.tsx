import {useId, useState} from "react";

import {Eyebrow} from "@/components/landing/Eyebrow";
import {smeFeatureTabsContent} from "@/content/sme";

import {FeatureTabsVisual} from "./FeatureTabsVisual";
import {InfoCard} from "./InfoCard";
import {TabButton} from "./TabButton";

type TabId = (typeof smeFeatureTabsContent.tabs)[number]["id"];

export function FeatureTabs() {
  const [active, setActive] = useState<TabId>(smeFeatureTabsContent.defaultTab);
  const baseId = useId();
  const panel = smeFeatureTabsContent.panels[active];

  return (
    <section aria-labelledby="sme-features-heading" className="bg-white">
      <div className="mx-auto flex max-w-[1202px] flex-col items-center gap-10 px-6 py-16 md:px-10 lg:gap-12 lg:py-25">
        <div className="flex max-w-[720px] flex-col items-center gap-5 text-center">
          <Eyebrow label={smeFeatureTabsContent.eyebrow} />
          <h2 id="sme-features-heading" className="text-[36px] font-bold leading-[1.1] tracking-[-0.02em] text-black sm:text-[42px]">
            {smeFeatureTabsContent.heading}
          </h2>
        </div>

        <div className="flex w-full flex-col gap-8">
          <div role="tablist" aria-label="Business features" className="flex flex-wrap justify-center gap-2">
            {smeFeatureTabsContent.tabs.map((tab) => (
              <TabButton key={tab.id} baseId={baseId} tab={tab} active={active === tab.id} onClick={() => setActive(tab.id)} />
            ))}
          </div>

          <div className="flex w-full flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-14">
            <InfoCard heading={panel.heading} body={panel.body} bullets={panel.bullets} />
            <div
              id={`${baseId}-panel-${active}`}
              role="tabpanel"
              aria-labelledby={`${baseId}-tab-${active}`}
              className="w-full lg:max-w-[644px]"
            >
              <FeatureTabsVisual active={active} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
