import {useState} from "react";
import type {SafeNode, SafeSize} from "@/types/safe-types";

/** The wizard's field state — node, locker size, duration, and optional contents. */
export function useSafeSelection() {
  const [node, setNode] = useState<SafeNode | null>(null);
  const [size, setSize] = useState<SafeSize | null>(null);
  const [durationId, setDurationId] = useState<string | null>(null);
  const [storing, setStoring] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);

  const pickNode = (picked: SafeNode) => {
    setNode(picked);
    setPickerOpen(false);
  };

  const quoteInput = size !== null && durationId !== null ? {size, durationId} : null;
  const nodeReady = node !== null && node.safes > 0 && node.status === "available";
  const optionsReady = size !== null && durationId !== null;

  return {
    node,
    size,
    setSize,
    durationId,
    setDurationId,
    storing,
    setStoring,
    pickerOpen,
    setPickerOpen,
    pickNode,
    quoteInput,
    nodeReady,
    optionsReady,
  };
}
