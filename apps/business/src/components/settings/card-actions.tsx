interface CardActionsProps {
  cancelLabel: string;
  saveLabel: string;
  onCancel: () => void;
  isSaving: boolean;
  /** Grey out the primary action, e.g. until the form is dirty or valid. */
  saveDisabled?: boolean;
}

/** The card-footer button pair: grey outline secondary action, teal primary action. */
export function CardActions({cancelLabel, saveLabel, onCancel, isSaving, saveDisabled}: CardActionsProps) {
  return (
    <>
      <button
        type="button"
        onClick={onCancel}
        className="flex h-[38px] items-center justify-center rounded-lg border border-grey-600 px-3 py-2 text-base leading-[1.4] font-medium tracking-[0.32px] text-grey-600 hover:bg-grey-100"
      >
        {cancelLabel}
      </button>
      <button
        type="submit"
        disabled={saveDisabled || isSaving}
        className="flex h-[38px] items-center justify-center rounded-lg bg-primary-500 px-3 py-2 text-base leading-[1.4] font-medium tracking-[0.32px] text-white enabled:hover:bg-primary-600 disabled:opacity-50"
      >
        {saveLabel}
      </button>
    </>
  );
}
