import {useState} from "react";
import {HomeSheet} from "@/components/home/home-sheet";
import {LocationSheet} from "@/components/home/location-sheet";
import {LockerModal} from "@/components/home/locker-modal";
import {MapView} from "@/components/home/map-view";
import {SendTermsDialog} from "@/components/send/terms-dialog";
import {TourOverlay} from "@/components/tour/tour-overlay";
import {TOUR_STEPS} from "@/components/tour/tour-steps";
import {useHomeTour} from "@/components/tour/use-home-tour";
import {WelcomeSheet} from "@/components/tour/welcome-sheet";
import {useAreaQuery, useLockerQuery, useLockersQuery} from "@/queries/use-home-queries";

/**
 * Home: the static map with locker pins behind a collapsible sheet. Collapsed shows the
 * header + track input over the map; expanded adds actions, the promo banner, and activity.
 * A first-visit welcome sheet + spotlight tour plays on top (persisted via localStorage).
 */
export function HomePage() {
  const [expanded, setExpanded] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [lockerId, setLockerId] = useState<string | null>(null);
  const [termsFor, setTermsFor] = useState<"send" | "store" | null>(null);
  const tour = useHomeTour();
  const area = useAreaQuery();
  const lockers = useLockersQuery();
  const locker = useLockerQuery(lockerId);

  const startTour = () => {
    setExpanded(true);
    tour.startTour();
  };
  const step = typeof tour.phase === "number" ? TOUR_STEPS[tour.phase] : null;

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-[#eef1f4]">
      <MapView lockers={lockers.data ?? []} onPick={setLockerId} />
      <HomeSheet
        expanded={expanded}
        area={area.data ?? "Oshodi"}
        onToggle={() => setExpanded((e) => !e)}
        onOpenLocation={() => setLocationOpen(true)}
        onSend={() => setTermsFor("send")}
        onStore={() => setTermsFor("store")}
      />
      <SendTermsDialog open={termsFor !== null} to={termsFor === "store" ? "/safe" : "/send"} onClose={() => setTermsFor(null)} />
      <LocationSheet open={locationOpen} onClose={() => setLocationOpen(false)} />
      <LockerModal open={lockerId !== null} locker={locker.data ?? null} onClose={() => setLockerId(null)} />
      <WelcomeSheet open={tour.phase === "welcome"} onSkip={tour.finish} onTour={startTour} />
      {step ? <TourOverlay step={step} area={area.data ?? "Oshodi"} onSkip={tour.finish} onNext={tour.next} /> : null}
    </main>
  );
}
