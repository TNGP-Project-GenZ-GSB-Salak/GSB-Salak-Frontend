// A centered, native-alert-style modal — distinct from BottomSheet. Matches
// the prototype's KYC confirmation dialog: a small centered card with a
// message and two stacked text actions, not a bottom-anchored panel.
interface ConfirmDialogProps {
  open: boolean;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ open, message, confirmLabel, cancelLabel, onConfirm, onCancel }: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="confirm-dialog-backdrop" onClick={onCancel}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <p className="confirm-dialog__message">{message}</p>
        <div className="confirm-dialog__actions">
          <button type="button" className="confirm-dialog__action" onClick={onConfirm} data-testid="confirm-dialog-confirm">
            {confirmLabel}
          </button>
          <button
            type="button"
            className="confirm-dialog__action confirm-dialog__action--muted"
            onClick={onCancel}
            data-testid="confirm-dialog-cancel"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
