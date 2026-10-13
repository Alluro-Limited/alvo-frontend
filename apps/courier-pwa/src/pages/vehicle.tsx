import {useState} from "react";
import {useNavigate} from "@tanstack/react-router";
import {FormField} from "@/components/form/form-field";
import {SelectInput} from "@/components/form/select-input";
import {WizardHeader} from "@/components/sign-up/wizard-header";
import {CapacityCard} from "@/components/vehicle/capacity-card";
import {RequestSubmitted} from "@/components/vehicle/request-submitted";
import {VehicleChangeSheet} from "@/components/vehicle/vehicle-change-sheet";
import {VEHICLE_TYPES} from "@/lib/vehicle-capacity";
import {m} from "@/paraglide/messages";
import {useProfileQuery, useVehicleChangeMutation} from "@/queries/use-earnings-queries";
import type {VehicleType} from "@/types/earnings-types";

/** Vehicle & Package Capacity — the Account "Vehicle" row target. Pick → confirm sheet → submitted. */
export function VehiclePage() {
  const navigate = useNavigate();
  const profile = useProfileQuery();
  const [submitted, setSubmitted] = useState<VehicleType | null>(null);

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-white px-6 pt-[max(24px,env(safe-area-inset-top))] pb-[max(24px,env(safe-area-inset-bottom))]">
      <WizardHeader step={0} onBack={() => void navigate({to: "/profile"})} />
      {submitted ? (
        <RequestSubmitted vehicle={submitted} />
      ) : (
        <>
          <h1 className="mt-9 text-[24px] leading-[30px] font-medium tracking-[-0.01em]">{m["veh.title"]()}</h1>
          {profile.isPending || !profile.data ? (
            <div className="mt-6 h-[230px] animate-pulse rounded-[12px] bg-grey-100" />
          ) : (
            <VehiclePicker current={profile.data.vehicle} onSubmitted={setSubmitted} />
          )}
        </>
      )}
    </main>
  );
}

function VehiclePicker({current, onSubmitted}: {current: VehicleType; onSubmitted: (v: VehicleType) => void}) {
  const change = useVehicleChangeMutation();
  const [choice, setChoice] = useState<VehicleType>(current);
  const [confirming, setConfirming] = useState(false);

  const confirm = () =>
    change.mutate(choice, {
      onSuccess: () => {
        setConfirming(false);
        onSubmitted(choice);
      },
    });

  return (
    <div className="mt-6 flex flex-1 flex-col gap-5">
      <FormField label={m["veh.type"]()}>
        {(control) => (
          <SelectInput {...control} value={choice} onChange={(e) => setChoice(e.target.value as VehicleType)}>
            {VEHICLE_TYPES.map((type) => (
              <option key={type} value={type}>
                {m[`veh.${type}`]()}
              </option>
            ))}
          </SelectInput>
        )}
      </FormField>
      <CapacityCard vehicle={choice} />
      <button
        type="button"
        onClick={() => setConfirming(true)}
        disabled={choice === current}
        className="mt-auto h-[50px] w-full rounded-[8px] bg-primary-500 text-[16px] font-medium text-white disabled:bg-grey-300 disabled:text-grey-500"
      >
        {m["vehc.request"]()}
      </button>
      <VehicleChangeSheet
        from={current}
        to={choice}
        open={confirming}
        pending={change.isPending}
        onConfirm={confirm}
        onClose={() => setConfirming(false)}
      />
    </div>
  );
}
