import {useState} from "react";
import {useAssignCourierMutation} from "@/queries/use-assign-courier-mutation";
import {useAssignableQuery} from "@/queries/use-assignable-query";
import {useIdleCouriersQuery} from "@/queries/use-idle-couriers-query";

/** Two-step manual-assign state: assignment pick, courier pick, queries, and the confirm mutation. */
export function useManualAssign(
  preselectId: string | null,
  onClose: () => void,
  onAssigned: (assignmentId: string, courierName: string) => void
) {
  const [step, setStep] = useState<1 | 2>(1);
  const [assignmentId, setAssignmentId] = useState<string | null>(preselectId);
  const [courierId, setCourierId] = useState<string | null>(null);
  const [courierQuery, setCourierQuery] = useState("");

  const assignable = useAssignableQuery(true);
  const couriers = useIdleCouriersQuery(courierQuery, step === 2);
  const assign = useAssignCourierMutation();

  const confirm = () => {
    if (!assignmentId || !courierId) return;
    const courier = couriers.data?.find((c) => c.id === courierId);
    assign.mutate(
      {assignmentId, courierId},
      {
        onSuccess: () => {
          onAssigned(assignmentId, courier?.name ?? courierId);
          onClose();
        },
      }
    );
  };

  return {
    step,
    setStep,
    assignmentId,
    setAssignmentId,
    courierId,
    setCourierId,
    courierQuery,
    setCourierQuery,
    assignable,
    couriers,
    assign,
    confirm,
  };
}
