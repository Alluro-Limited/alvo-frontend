import type {ShipmentPriority, ShipmentSize} from "@/types/dashboard-types";
import type {RecipientDraft} from "@/components/new-shipment/recipient-draft";

const HEADER_ALIASES = {
  name: "name",
  phone: "phone",
  locker_id: "lockerId",
  parcel_size: "size",
  priority: "priority",
} as const;

const SIZES = new Set<ShipmentSize>(["S", "M", "B"]);
const PRIORITIES = new Set<ShipmentPriority>(["standard", "express"]);

/** Rows 5 and 6 of the template give recipients a ready-made example. */
export const CSV_TEMPLATE = [
  "name,phone,locker_id,parcel_size,priority",
  "Khadija Rabiu,08034412210,locker-1,M,express",
  "Musa Abubakar,08123349901,locker-2,S,standard",
].join("\n");

type ParsedCsv = {rows: string[][]; error: "empty" | "header" | null};

function splitRows(text: string): ParsedCsv {
  const rows = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line !== "")
    .map((line) => line.split(",").map((cell) => cell.trim()));
  if (rows.length === 0) return {rows: [], error: "empty"};
  const headers = new Set(rows[0].map((cell) => cell.toLowerCase()));
  const required = (Object.keys(HEADER_ALIASES) as (keyof typeof HEADER_ALIASES)[]).filter((key) => key !== "priority");
  if (required.some((key) => !headers.has(key))) return {rows, error: "header"};
  return {rows, error: null};
}

/**
 * Parses the template format (`name,phone,locker_id,parcel_size[,priority]`) into
 * recipient drafts. `csvRow` keeps the source line number for row-level error copy.
 */
export function parseShipmentsCsv(text: string): {recipients: RecipientDraft[]; error: "empty" | "header" | null} {
  const {rows, error} = splitRows(text);
  if (error !== null) return {recipients: [], error};
  const headers = rows[0].map((cell) => cell.toLowerCase());
  const indexOf = (key: keyof typeof HEADER_ALIASES) => headers.indexOf(key);

  const recipients = rows.slice(1).map((cells, index): RecipientDraft => {
    const size = cells[indexOf("parcel_size")]?.toUpperCase() ?? "";
    const priority = cells[indexOf("priority")]?.toLowerCase() ?? "";
    return {
      id: crypto.randomUUID(),
      csvRow: index + 2,
      name: cells[indexOf("name")] ?? "",
      phone: cells[indexOf("phone")] ?? "",
      lockerId: cells[indexOf("locker_id")] ?? "",
      size: SIZES.has(size as ShipmentSize) ? (size as ShipmentSize) : "S",
      priority: PRIORITIES.has(priority as ShipmentPriority) ? (priority as ShipmentPriority) : "standard",
    };
  });
  return {recipients, error: null};
}
