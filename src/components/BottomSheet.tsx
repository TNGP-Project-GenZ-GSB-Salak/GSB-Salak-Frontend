import type { MouseEvent, ReactNode } from "react";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  "data-testid"?: string;
}

// Generic backdrop + slide-up panel used by every sheet in the buy flow
// (mode-choose, product detail, amount picker, keypad). Matches the
// prototype's `position:absolute;inset:0` backdrop + bottom-aligned panel.
export function BottomSheet({ open, onClose, children, ...rest }: BottomSheetProps) {
  if (!open) return null;

  function stop(event: MouseEvent) {
    event.stopPropagation();
  }

  return (
    <div className="bottom-sheet-backdrop" onClick={onClose} {...rest}>
      <div className="bottom-sheet-panel" onClick={stop}>
        {children}
      </div>
    </div>
  );
}
