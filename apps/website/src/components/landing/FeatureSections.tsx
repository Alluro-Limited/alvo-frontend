import {FeatureRow} from "./FeatureRow";

import {featureRows} from "@/content/landing";

export function FeatureSections() {
  return (
    <section aria-label="How Alvo works for you">
      <div className="mx-auto flex max-w-360 flex-col gap-16 px-6 py-16 md:px-10 lg:gap-20 lg:px-30 lg:py-25">
        {featureRows.map((row) => (
          <FeatureRow key={row.id} row={row} />
        ))}
      </div>
    </section>
  );
}
