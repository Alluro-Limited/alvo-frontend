import {m} from "@/paraglide/messages";
import {useOnboarding, type TourTargetId} from "./onboarding-context";
import {TourTooltip} from "./tour-tooltip";
import {useTourGeometry} from "./use-tour-geometry";

const STEP_CONTENT: Record<TourTargetId, {title: () => string; body: () => string}> = {
  stats: {title: m["tour.stats_title"], body: m["tour.stats_body"]},
  "new-shipment": {title: m["tour.batch_title"], body: m["tour.batch_body"]},
  shipments: {title: m["tour.shipments_title"], body: m["tour.shipments_body"]},
  wallet: {title: m["tour.wallet_title"], body: m["tour.wallet_body"]},
};

function SpotlightHole({rect}: {rect: DOMRect}) {
  return (
    <div
      className="pointer-events-none absolute rounded-lg"
      style={{
        top: rect.top - 4,
        left: rect.left - 4,
        width: rect.width + 8,
        height: rect.height + 8,
        boxShadow: "0 0 0 9999px rgb(0 0 0 / 0.55)",
      }}
      aria-hidden="true"
    />
  );
}

/** Dimmed overlay that punches a spotlight hole over the current tour target and anchors the tooltip to it. */
export function TourOverlay() {
  const {tourStep, tourTargetId, nextStep, endTour} = useOnboarding();
  const {tooltipRef, geometry} = useTourGeometry(tourTargetId, tourStep);

  if (tourStep === null || !tourTargetId) return null;
  const content = STEP_CONTENT[tourTargetId];

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0" onClick={(event) => event.stopPropagation()} aria-hidden="true" />
      {geometry && <SpotlightHole rect={geometry.rect} />}
      <TourTooltip
        ref={tooltipRef}
        side={tourTargetId === "stats" ? "top" : "left"}
        title={content.title()}
        body={content.body()}
        onSkip={endTour}
        onNext={nextStep}
        style={{
          top: geometry?.position.top ?? -9999,
          left: geometry?.position.left ?? -9999,
        }}
      />
    </div>
  );
}
