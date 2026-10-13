import {useState} from "react";
import type {DeliverySpeed, LockerNode, NodeRole, PackageSize, QuoteInput, RecipientDetails} from "@/types/send-types";

const EMPTY_RECIPIENT: RecipientDetails = {name: "", phone: "", email: "", note: "", saveToContacts: false};

/** The wizard's field state — everything the user picks before review. */
export function useSendSelection() {
  const [size, setSize] = useState<PackageSize | null>(null);
  const [contents, setContents] = useState("");
  const [fragile, setFragile] = useState(false);
  const [origin, setOrigin] = useState<LockerNode | null>(null);
  const [destination, setDestination] = useState<LockerNode | null>(null);
  const [favorite, setFavorite] = useState(false);
  const [speed, setSpeed] = useState<DeliverySpeed>("standard");
  const [recipient, setRecipient] = useState<RecipientDetails>(EMPTY_RECIPIENT);
  const [picker, setPicker] = useState<NodeRole | null>(null);

  const quoteInput: QuoteInput | null = size ? {size, fragile, speed} : null;
  const nodesReady = origin !== null && destination !== null && origin.status === "available" && destination.status === "available";

  const pickNode = (node: LockerNode) => {
    if (picker === "origin") setOrigin(node);
    else setDestination(node);
    setPicker(null);
  };

  return {
    size,
    setSize,
    contents,
    setContents,
    fragile,
    setFragile,
    origin,
    destination,
    favorite,
    setFavorite,
    speed,
    setSpeed,
    recipient,
    setRecipient: (patch: Partial<RecipientDetails>) => setRecipient((r) => ({...r, ...patch})),
    picker,
    setPicker,
    pickNode,
    quoteInput,
    nodesReady,
  };
}
