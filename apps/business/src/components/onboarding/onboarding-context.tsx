import {createContext, useContext, useMemo, useState, type ReactNode} from "react";
import {consumeOnboardingPending} from "@/lib/onboarding-flag";

export type TourTargetId = "stats" | "new-shipment" | "shipments" | "wallet";

/** The four tooltips from the Figma tour, in order. */
export const TOUR_STEPS: TourTargetId[] = ["stats", "new-shipment", "shipments", "wallet"];

interface OnboardingContextValue {
  welcomeOpen: boolean;
  /** Index into `TOUR_STEPS`, or null when the tour is not running. */
  tourStep: number | null;
  /** The `data-tour` anchor the current step highlights. */
  tourTargetId: TourTargetId | null;
  startTour: () => void;
  nextStep: () => void;
  endTour: () => void;
  closeWelcome: () => void;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({children}: {children: ReactNode}) {
  const [welcomeOpen, setWelcomeOpen] = useState(consumeOnboardingPending);
  const [tourStep, setTourStep] = useState<number | null>(null);

  const value = useMemo<OnboardingContextValue>(
    () => ({
      welcomeOpen,
      tourStep,
      tourTargetId: tourStep === null ? null : TOUR_STEPS[tourStep],
      startTour: () => {
        setWelcomeOpen(false);
        setTourStep(0);
      },
      nextStep: () => setTourStep((step) => (step !== null && step < TOUR_STEPS.length - 1 ? step + 1 : null)),
      endTour: () => setTourStep(null),
      closeWelcome: () => setWelcomeOpen(false),
    }),
    [welcomeOpen, tourStep]
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) throw new Error("useOnboarding must be used within OnboardingProvider");
  return context;
}
