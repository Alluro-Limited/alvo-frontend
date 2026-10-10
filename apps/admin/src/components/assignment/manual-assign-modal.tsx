import type {UseQueryResult} from "@tanstack/react-query";
import {Button, Dialog, DialogBackdrop, DialogClose, DialogDescription, DialogPopup, DialogPortal, DialogTitle} from "@alvo/ui";
import {UserPlus} from "lucide-react";
import {cn} from "cnfast";
import {m} from "@/paraglide/messages";
import {useManualAssign} from "./use-manual-assign";
import type {AssignableAssignment, IdleCourier} from "@/types/assignment-types";
import wlClose from "@/assets/wl-close.svg";
import {AssignStepAssignment} from "./assign-step-assignment";
import {AssignStepCourier} from "./assign-step-courier";

interface ManualAssignModalProps {
  open: boolean;
  /** Pre-selected assignment (public-pool pull-back). Null = start with nothing selected. */
  preselectId: string | null;
  onClose: () => void;
  /** Called after the assignment succeeds — parent shows the toast. */
  onAssigned: (assignmentId: string, courierName: string) => void;
}

/** The two-step "Manual assignment" modal — pick an assignment, then an idle courier. */
export function ManualAssignModal({open, preselectId, onClose, onAssigned}: ManualAssignModalProps) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup className="w-[560px] max-w-[calc(100vw-32px)] p-6">
          {open && <ModalBody preselectId={preselectId} onClose={onClose} onAssigned={onAssigned} />}
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}

/** Mounted fresh per open so selections/queries never leak between sessions. */
function ModalBody({
  preselectId,
  onClose,
  onAssigned,
}: {
  preselectId: string | null;
  onClose: () => void;
  onAssigned: (assignmentId: string, courierName: string) => void;
}) {
  const flow = useManualAssign(preselectId, onClose, onAssigned);
  const {step, assignable, couriers, assignmentId, courierId, courierQuery, assign} = flow;

  return (
    <>
      <ModalHeader step={step} />
      <AssignStepper step={step} />
      <div className="pt-4">
        <StepContent
          step={step}
          assignable={assignable}
          couriers={couriers}
          assignmentId={assignmentId}
          courierId={courierId}
          courierQuery={courierQuery}
          onSelectAssignment={flow.setAssignmentId}
          onCourierQuery={flow.setCourierQuery}
          onSelectCourier={flow.setCourierId}
        />
        {assign.isError && <p className="pt-3 text-sm text-status-fail-dark">{m["assignment.assign_error"]()}</p>}
      </div>
      <ModalFooter
        step={step}
        canContinue={assignmentId !== null}
        canConfirm={courierId !== null}
        submitting={assign.isPending}
        onBack={() => flow.setStep(1)}
        onContinue={() => flow.setStep(2)}
        onCancel={onClose}
        onConfirm={flow.confirm}
      />
    </>
  );
}

interface StepContentProps {
  step: 1 | 2;
  assignable: UseQueryResult<AssignableAssignment[]>;
  couriers: UseQueryResult<IdleCourier[]>;
  assignmentId: string | null;
  courierId: string | null;
  courierQuery: string;
  onSelectAssignment: (id: string) => void;
  onCourierQuery: (value: string) => void;
  onSelectCourier: (id: string) => void;
}

function StepContent({
  step,
  assignable,
  couriers,
  assignmentId,
  courierId,
  courierQuery,
  onSelectAssignment,
  onCourierQuery,
  onSelectCourier,
}: StepContentProps) {
  if (step === 1) {
    return (
      <AssignStepAssignment
        options={assignable.data ?? []}
        loading={assignable.isPending}
        selected={assignmentId}
        onSelect={onSelectAssignment}
      />
    );
  }
  return (
    <AssignStepCourier
      chosen={assignable.data?.find((option) => option.id === assignmentId)}
      options={couriers.data ?? []}
      loading={couriers.isPending}
      query={courierQuery}
      selected={courierId}
      onQuery={onCourierQuery}
      onSelect={onSelectCourier}
    />
  );
}

function ModalHeader({step}: {step: 1 | 2}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-full bg-primary-50 text-primary-600" aria-hidden="true">
          <UserPlus className="size-5" />
        </span>
        <div>
          <DialogTitle className="text-xl leading-[1.3] font-semibold text-black">{m["assignment.assign_title"]()}</DialogTitle>
          <DialogDescription className="pt-0.5 text-sm leading-[1.4] tracking-[0.14px] text-grey-500">
            {step === 1 ? m["assignment.assign_step1_subtitle"]() : m["assignment.assign_step2_subtitle"]()}
          </DialogDescription>
        </div>
      </div>
      <DialogClose className="rounded p-0.5 text-grey-600 hover:bg-grey-100" aria-label={m["workloads.close"]()}>
        <img src={wlClose} alt="" className="size-6" aria-hidden="true" />
      </DialogClose>
    </div>
  );
}

const STEPS: {n: 1 | 2; label: () => string}[] = [
  {n: 1, label: m["assignment.assign_step1_label"]},
  {n: 2, label: m["assignment.assign_step2_label"]},
];

/** The numbered step indicator under the modal header. */
function AssignStepper({step}: {step: 1 | 2}) {
  return (
    <ol className="flex items-center gap-2 pt-5" aria-hidden="true">
      {STEPS.map(({n, label}, index) => (
        <li key={n} className="flex items-center gap-2">
          {index > 0 && <span className={cn("h-0.5 w-16 rounded-full", step >= n ? "bg-primary-500" : "bg-grey-200")} />}
          <span
            className={cn(
              "flex size-5 items-center justify-center rounded-full text-xs font-semibold",
              step >= n ? "bg-primary-500 text-white" : "bg-grey-200 text-grey-500"
            )}
          >
            {n}
          </span>
          <span className={cn("text-sm leading-[1.4] tracking-[0.14px]", step >= n ? "font-medium text-black" : "text-grey-500")}>
            {label()}
          </span>
        </li>
      ))}
    </ol>
  );
}

interface ModalFooterProps {
  step: 1 | 2;
  canContinue: boolean;
  canConfirm: boolean;
  submitting: boolean;
  onBack: () => void;
  onContinue: () => void;
  onCancel: () => void;
  onConfirm: () => void;
}

function ModalFooter({step, canContinue, canConfirm, submitting, onBack, onContinue, onCancel, onConfirm}: ModalFooterProps) {
  return (
    <div className="flex items-center justify-end gap-2 pt-5">
      {step === 1 ? (
        <>
          <Button variant="outline" onClick={onCancel}>
            {m["assignment.assign_cancel"]()}
          </Button>
          <Button disabled={!canContinue} onClick={onContinue}>
            {m["assignment.assign_continue"]()}
          </Button>
        </>
      ) : (
        <>
          <Button variant="outline" onClick={onBack}>
            {m["assignment.assign_back"]()}
          </Button>
          <Button disabled={!canConfirm} isLoading={submitting} onClick={onConfirm}>
            {submitting ? m["assignment.assign_confirming"]() : m["assignment.assign_confirm"]()}
          </Button>
        </>
      )}
    </div>
  );
}
