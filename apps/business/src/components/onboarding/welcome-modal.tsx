import {Button, Dialog, DialogBackdrop, DialogDescription, DialogPopup, DialogPortal, DialogTitle} from "@alvo/ui";
import {Link} from "@tanstack/react-router";
import {m} from "@/paraglide/messages";
import welcomeIllustrationUrl from "@/assets/welcome-illustration.png";
import {useOnboarding} from "./onboarding-context";

/** First-run greeting: 520px white card with the confetti illustration, Start tour / Create batches. */
export function WelcomeModal() {
  const {welcomeOpen, closeWelcome, startTour} = useOnboarding();

  return (
    <Dialog open={welcomeOpen} onOpenChange={(open) => !open && closeWelcome()}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup className="flex w-[520px] flex-col items-center gap-10 p-12">
          <img src={welcomeIllustrationUrl} alt="" aria-hidden="true" className="h-[127px] w-[150px]" />
          <div className="flex w-full flex-col items-center gap-8">
            <div className="flex w-full flex-col items-center gap-2 text-center text-black">
              <DialogTitle className="text-2xl tracking-[-0.24px]">{m["welcome.title"]()}</DialogTitle>
              <DialogDescription className="text-sm leading-[1.4] tracking-[0.14px] opacity-70">
                {m["welcome.description"]()}
              </DialogDescription>
            </div>
            <div className="flex w-full gap-3">
              <Button variant="outline" className="flex-1" onClick={startTour}>
                {m["welcome.start_tour"]()}
              </Button>
              <Button className="flex-1" render={<Link to="/new-shipment" />} nativeButton={false}>
                {m["welcome.create_batches"]()}
              </Button>
            </div>
          </div>
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}
