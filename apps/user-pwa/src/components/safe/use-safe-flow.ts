import {useState} from "react";
import {useNavigate} from "@tanstack/react-router";
import {useSafeSelection} from "./use-safe-selection";
import type {SafeReservation} from "@/types/safe-types";
import type {PaymentChannel} from "@/types/send-types";

export type SafeStep = "node" | "options" | "review" | "reserved" | "code";

const PREV: Partial<Record<SafeStep, SafeStep>> = {
  options: "node",
  review: "options",
  code: "reserved",
};

/** State machine for the Safe Storage wizard: node → options → review → reserved → code. */
export function useSafeFlow() {
  const navigate = useNavigate();
  const selection = useSafeSelection();
  const [step, setStep] = useState<SafeStep>("node");
  const [channel, setChannel] = useState<PaymentChannel | null>(null);
  const [reservation, setReservation] = useState<SafeReservation | null>(null);
  const [guideOpen, setGuideOpen] = useState(false);
  const [gatewayOpen, setGatewayOpen] = useState(false);

  const back = () => {
    const prev = PREV[step];
    if (prev) setStep(prev);
    else void navigate({to: "/home"});
  };

  return {
    ...selection,
    step,
    setStep,
    channel,
    setChannel,
    reservation,
    setReservation,
    guideOpen,
    setGuideOpen,
    gatewayOpen,
    setGatewayOpen,
    back,
  };
}
