import {useState} from "react";
import {useLockersQuery} from "@/queries/use-shipment-queries";
import {useBatchDetails} from "./use-batch-details";
import {useBatchPayment} from "./use-batch-payment";
import {useBatchRecipients} from "./use-batch-recipients";

export type BatchStep = 1 | 2 | 3 | 4;

/** Composes details, recipients, and payment into the 4-step wizard state machine. */
export function useBatchWizard() {
  const {data: lockers = []} = useLockersQuery();
  const details = useBatchDetails(lockers);
  const recipients = useBatchRecipients(lockers);
  const payment = useBatchPayment({details, recipients});
  const [step, setStep] = useState<BatchStep>(1);

  const canReview = recipients.validRows.length > 0;

  function back() {
    setStep((current) => (current > 1 ? ((current - 1) as BatchStep) : current));
  }

  function next() {
    if (step === 1 && !details.step1Valid) {
      details.setStep1Attempted(true);
      return;
    }
    if (step === 2 && !canReview) return;
    setStep((current) => (current < 4 ? ((current + 1) as BatchStep) : current));
  }

  /** Review's Resolve action sends the user back to manual entry to fix the flagged row. */
  function resolveRow() {
    recipients.setEntryTab("manual");
    setStep(2);
  }

  return {step, lockers, details, recipients, payment, canReview, back, next, resolveRow};
}
