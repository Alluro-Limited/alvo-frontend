import {Button} from "@alvo/ui";
import {AuthSheet} from "@/components/auth/auth-sheet";
import welcomeArtUrl from "@/assets/tour-welcome.png";
import {m} from "@/paraglide/messages";

interface WelcomeSheetProps {
  open: boolean;
  onSkip: () => void;
  onTour: () => void;
}

/** First-visit "Private & Secure Delivery" bottom sheet — Skip or Take a Tour. */
export function WelcomeSheet({open, onSkip, onTour}: WelcomeSheetProps) {
  return (
    <AuthSheet open={open} onClose={onSkip}>
      <div className="mt-2 flex w-full flex-col items-center gap-4">
        <div className="flex w-full flex-col gap-1.5 text-center">
          <h2 className="text-[24px] font-medium leading-[1.2] tracking-[-0.24px] text-foreground">{m["tour.welcome_title"]()}</h2>
          <p className="text-[14px] leading-[1.4] tracking-[0.14px] text-foreground/60">{m["tour.welcome_desc"]()}</p>
        </div>
        <div className="h-[199px] w-full overflow-clip rounded-[12px]">
          <img src={welcomeArtUrl} alt="" aria-hidden="true" className="h-[400px] w-[400px] max-w-none object-cover" />
        </div>
        <div className="mt-2 flex w-full gap-2.5">
          <button
            type="button"
            onClick={onSkip}
            className="flex h-[50px] flex-1 items-center justify-center rounded-[8px] bg-[#f2f2f2] px-5 py-3.5 text-[16px] font-medium leading-[1.4] tracking-[0.32px] text-primary-900"
          >
            {m["tour.skip"]()}
          </button>
          <Button className="h-[50px] flex-1 text-[16px] font-medium" onClick={onTour}>
            {m["tour.take_tour"]()}
          </Button>
        </div>
      </div>
    </AuthSheet>
  );
}
