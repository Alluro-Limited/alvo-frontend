import {useState} from "react";
import {useNavigate} from "@tanstack/react-router";
import {AreaOption} from "@/components/delivery-area/area-option";
import {WizardHeader} from "@/components/sign-up/wizard-header";
import {areaToast} from "@/lib/area-toast";
import {m} from "@/paraglide/messages";
import {useAreasQuery, useSetDeliveryAreaMutation} from "@/queries/use-home-queries";

/**
 * Change Delivery Area — the home header's "Delivery Area: X ⌄" target.
 * Confirm writes the area, flags the toast, and returns to Home.
 */
export function DeliveryAreaPage() {
  const navigate = useNavigate();
  const areas = useAreasQuery();
  const setArea = useSetDeliveryAreaMutation();
  const [selected, setSelected] = useState<string | null>(null);

  const confirm = () => {
    if (!selected) return;
    setArea.mutate(selected, {
      onSuccess: () => {
        areaToast.pending = true;
        void navigate({to: "/home"});
      },
    });
  };

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-white px-6 pt-[max(24px,env(safe-area-inset-top))] pb-[max(24px,env(safe-area-inset-bottom))]">
      <WizardHeader step={0} onBack={() => void navigate({to: "/home"})} />
      <h1 className="mt-9 text-[28px] leading-[34px] font-bold tracking-[-0.02em]">{m["area.title"]()}</h1>
      <p className="mt-2 text-[14px] leading-[22px] text-grey-600">{m["area.subtitle"]()}</p>
      <div className="mt-8 flex-1 overflow-y-auto">
        {areas.isPending || !areas.data ? (
          <div className="flex flex-col gap-3">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="h-14 animate-pulse rounded-[10px] bg-grey-100" />
            ))}
          </div>
        ) : (
          areas.data.map((area) => (
            <AreaOption key={area.id} area={area} selected={selected === area.id} onSelect={() => setSelected(area.id)} />
          ))
        )}
      </div>
      <button
        type="button"
        onClick={confirm}
        disabled={!selected || setArea.isPending}
        className="mt-4 h-[50px] w-full shrink-0 rounded-[10px] bg-primary-500 text-[16px] font-semibold text-white disabled:bg-grey-300 disabled:text-grey-500"
      >
        {m["area.confirm"]()}
      </button>
    </main>
  );
}
