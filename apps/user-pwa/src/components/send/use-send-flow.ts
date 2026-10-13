import {useState} from "react";
import {useNavigate} from "@tanstack/react-router";
import {useSendSelection} from "./use-send-selection";
import type {PaymentChannel, SendBooking} from "@/types/send-types";

export type SendStep = "service" | "package" | "nodes" | "recipient" | "review" | "confirmed" | "code";

const PREV: Partial<Record<SendStep, SendStep>> = {
  package: "service",
  nodes: "package",
  recipient: "nodes",
  review: "recipient",
  code: "confirmed",
};

/** State machine for the Send Securely wizard: service → package → nodes → recipient → review → confirmed → code. */
export function useSendFlow() {
  const navigate = useNavigate();
  const selection = useSendSelection();
  const [step, setStep] = useState<SendStep>("service");
  const [channel, setChannel] = useState<PaymentChannel | null>(null);
  const [booking, setBooking] = useState<SendBooking | null>(null);
  const [guideOpen, setGuideOpen] = useState(false);

  const back = () => {
    const prev = PREV[step];
    if (prev) setStep(prev);
    else void navigate({to: "/home"});
  };

  return {...selection, step, setStep, channel, setChannel, booking, setBooking, guideOpen, setGuideOpen, back};
}
