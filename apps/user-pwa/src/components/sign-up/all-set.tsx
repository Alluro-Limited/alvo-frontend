import {useState} from "react";
import {useNavigate} from "@tanstack/react-router";
import {Button} from "@alvo/ui";
import {LocationSheet} from "./location-sheet";
import {SuccessScreen} from "@/components/auth/success-screen";
import {m} from "@/paraglide/messages";

/** "You're All Set!" — pattern screen with Get Started + Find Nearby Lockers (opens the location sheet). */
export function AllSet() {
  const navigate = useNavigate();
  const [sheetOpen, setSheetOpen] = useState(false);

  const goHome = () => void navigate({to: "/home"});

  const allowLocation = () => {
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => goHome(),
        () => goHome()
      );
    } else {
      goHome();
    }
  };

  return (
    <>
      <SuccessScreen title={m["su.all_set"]()} description={m["su.all_set_desc"]()}>
        <Button className="w-full text-[16px] font-medium" onClick={goHome}>
          {m["su.get_started"]()}
        </Button>
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="flex h-[50px] w-full items-center justify-center rounded-[8px] px-5 py-3.5 text-[16px] font-medium leading-[1.4] tracking-[0.32px] text-primary-900"
        >
          {m["su.find_lockers"]()}
        </button>
      </SuccessScreen>
      <LocationSheet open={sheetOpen} onClose={() => setSheetOpen(false)} onAllow={allowLocation} />
    </>
  );
}
