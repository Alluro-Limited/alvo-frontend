import {m} from "@/paraglide/messages";

const REASON_LABELS: Record<string, () => string> = {
  power_failure: m["nodes.reason_power_failure"],
  connectivity_issue: m["nodes.reason_connectivity_issue"],
  hardware_fault: m["nodes.reason_hardware_fault"],
  scheduled_service: m["nodes.reason_scheduled_service"],
  compartment_repair: m["nodes.reason_compartment_repair"],
  hardware_upgrade: m["nodes.reason_hardware_upgrade"],
  partner_request: m["nodes.reason_partner_request"],
  contract_ended: m["nodes.reason_contract_ended"],
  location_closed: m["nodes.reason_location_closed"],
  replaced: m["nodes.reason_replaced"],
  resolved: m["nodes.reason_resolved"],
  reconnected: m["nodes.reason_reconnected"],
  back_in_service: m["nodes.reason_back_in_service"],
  others: m["nodes.reason_others"],
};

/** Reason id → display label; unknown backend ids render as-is so new reasons still show. */
export function nodeReasonLabel(id: string): string {
  return REASON_LABELS[id]?.() ?? id;
}
