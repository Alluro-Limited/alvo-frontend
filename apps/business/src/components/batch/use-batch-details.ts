import {useState} from "react";
import type {Locker} from "@/types/shipment-types";

/** Step-1 fields: batch name, origin locker, and optional internal notes. */
export function useBatchDetails(lockers: Locker[]) {
  const [name, setName] = useState("");
  const [originLockerId, setOriginLockerId] = useState("");
  const [notes, setNotes] = useState("");
  const [step1Attempted, setStep1Attempted] = useState(false);

  const origin = originLockerId || (lockers[0]?.id ?? "");
  const step1Valid = name.trim() !== "" && origin !== "";

  return {name, origin, notes, step1Attempted, step1Valid, setName, setOriginLockerId, setNotes, setStep1Attempted};
}

export type BatchDetails = ReturnType<typeof useBatchDetails>;
