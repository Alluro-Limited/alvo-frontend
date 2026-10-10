import {useNavigate} from "@tanstack/react-router";
import {Button, Dialog, DialogBackdrop, DialogDescription, DialogPopup, DialogPortal, DialogTitle} from "@alvo/ui";
import welcomeIllustration from "@/assets/welcome-illustration.png";
import {m} from "@/paraglide/messages";

interface WelcomeModalProps {
  /** Interim until the guided tour exists: closes the modal so the empty dashboard shows. */
  onStartTour: () => void;
}

/** First-run welcome over the dimmed dashboard. No close affordance — the design only offers the two actions. */
export function WelcomeModal({onStartTour}: WelcomeModalProps) {
  const navigate = useNavigate();
  return (
    <Dialog open modal>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup className="flex w-[520px] flex-col items-center gap-10 p-12">
          <img src={welcomeIllustration} alt="" className="h-[127px] w-[150px]" />
          <div className="flex w-full flex-col gap-8">
            <div className="flex flex-col items-center gap-2 text-center">
              <DialogTitle className="tracking-[-0.24px] text-black">{m["overview.welcome_title"]()}</DialogTitle>
              <DialogDescription className="tracking-[0.14px] text-black opacity-70">
                {m["overview.welcome_description"]()}
              </DialogDescription>
            </div>
            <div className="flex w-full gap-3">
              <Button variant="outline" className="flex-1 text-base tracking-[0.32px]" onClick={onStartTour}>
                {m["overview.start_tour"]()}
              </Button>
              <Button className="flex-1 text-base tracking-[0.32px]" onClick={() => navigate({to: "/nodes"})}>
                {m["overview.activate_first_node"]()}
              </Button>
            </div>
          </div>
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}
