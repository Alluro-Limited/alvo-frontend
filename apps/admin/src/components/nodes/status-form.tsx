import {useState} from "react";
import {Button} from "@alvo/ui";
import {Info} from "lucide-react";
import {cn} from "cnfast";
import {m} from "@/paraglide/messages";
import type {ChangeNodeStatusInput, NodeDetail, NodeStatus, NodeStatusOption} from "@/types/nodes-types";
import {nodeReasonLabel} from "./node-reason-labels";
import {NODE_STATUS_LABELS} from "./node-status-labels";
import {NodeStatusTag} from "./node-status-tag";

function TargetPicker({
  options,
  value,
  onChange,
}: {
  options: NodeStatusOption[];
  value: NodeStatus | null;
  onChange: (status: NodeStatus) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={m["nodes.change_to"]()}>
      {options.map((option) => (
        <button
          key={option.status}
          type="button"
          role="radio"
          aria-checked={value === option.status}
          onClick={() => onChange(option.status)}
          className={cn(
            "rounded-lg border px-3 py-2 text-sm leading-[1.4] font-medium tracking-[0.14px]",
            value === option.status
              ? "border-primary-500 bg-[#f6fdfd] text-primary-500"
              : "border-grey-300 text-grey-600 hover:border-grey-400"
          )}
        >
          {NODE_STATUS_LABELS[option.status]()}
        </button>
      ))}
    </div>
  );
}

function ReasonPicker({reasons, value, onChange}: {reasons: string[]; value: string; onChange: (reason: string) => void}) {
  return (
    <div className="flex flex-col gap-1" role="radiogroup" aria-label={m["nodes.reason_label"]()}>
      {reasons.map((reason) => (
        <label key={reason} className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 hover:bg-grey-100">
          <input
            type="radio"
            name="node-status-reason"
            checked={value === reason}
            onChange={() => onChange(reason)}
            className="size-4 accent-primary-500"
          />
          <span className="text-sm leading-[1.4] tracking-[0.14px] text-grey-600">{nodeReasonLabel(reason)}</span>
        </label>
      ))}
    </div>
  );
}

interface StatusFormProps {
  node: NodeDetail;
  initialStatus?: NodeStatus;
  submitting: boolean;
  failed: boolean;
  onCancel: () => void;
  onSubmit: (input: ChangeNodeStatusInput) => void;
}

/** The status-change form — current pill, target picker, per-target reasons, notes, audit callout, actions. */
export function StatusForm({node, initialStatus, submitting, failed, onCancel, onSubmit}: StatusFormProps) {
  const [target, setTarget] = useState<NodeStatus | null>(() =>
    initialStatus && node.statusOptions.some((option) => option.status === initialStatus) ? initialStatus : null
  );
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");

  const option = node.statusOptions.find((entry) => entry.status === target);
  const needsReason = option?.reasons != null;
  const canSubmit = target != null && (!needsReason || reason !== "") && !submitting;
  const pickTarget = (status: NodeStatus) => {
    setTarget(status);
    setReason("");
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!target || !canSubmit) return;
    onSubmit({status: target, reason: needsReason ? reason : undefined, notes: notes.trim() || undefined});
  };

  return (
    <form noValidate className="flex flex-col gap-5 pt-5" onSubmit={submit}>
      <div className="flex items-center gap-2">
        <span className="text-sm leading-[1.4] tracking-[0.14px] text-grey-600">{m["nodes.current_status"]()}</span>
        <NodeStatusTag status={node.status} />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{m["nodes.change_to"]()}</p>
        <TargetPicker options={node.statusOptions} value={target} onChange={pickTarget} />
      </div>
      <ReasonSection option={option} reason={reason} notes={notes} onReason={setReason} onNotes={setNotes} />
      <div className="flex items-start gap-2 rounded-lg bg-grey-100 p-3">
        <Info className="mt-0.5 size-4 shrink-0 text-grey-500" aria-hidden="true" />
        <p className="text-xs leading-[1.4] tracking-[0.12px] text-grey-600">{m["nodes.audit_notice"]()}</p>
      </div>
      {failed && <p className="text-sm leading-[1.4] tracking-[0.14px] text-status-fail">{m["nodes.submit_error"]()}</p>}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          {m["nodes.cancel"]()}
        </Button>
        <Button variant={canSubmit ? undefined : "disabled"} isLoading={submitting} type="submit">
          {submitting ? m["nodes.status_submitting"]() : m["nodes.status_submit"]()}
        </Button>
      </div>
    </form>
  );
}

function ReasonSection({
  option,
  reason,
  notes,
  onReason,
  onNotes,
}: {
  option: NodeStatusOption | undefined;
  reason: string;
  notes: string;
  onReason: (reason: string) => void;
  onNotes: (notes: string) => void;
}) {
  return (
    <>
      {option?.reasons && (
        <div className="flex flex-col gap-2">
          <p className="text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{m["nodes.reason_label"]()}</p>
          <ReasonPicker reasons={option.reasons} value={reason} onChange={onReason} />
        </div>
      )}
      {reason === "others" && (
        <label className="flex flex-col gap-2">
          <span className="text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{m["nodes.notes_label"]()}</span>
          <textarea
            value={notes}
            onChange={(event) => onNotes(event.target.value)}
            placeholder={m["nodes.notes_placeholder"]()}
            rows={3}
            className="resize-none rounded-lg border border-grey-300 px-3 py-2 text-sm leading-[1.4] tracking-[0.14px] text-black outline-none focus:border-primary-500"
          />
        </label>
      )}
    </>
  );
}
