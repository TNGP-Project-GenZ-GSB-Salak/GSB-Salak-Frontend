import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

const MAX_DRAG = 250;
const COMMIT_RATIO = 0.55;
const COMMIT_DELAY_MS = 220;

interface SlideToConfirmProps {
  disabled: boolean;
  label?: string;
  onConfirm: () => void;
}

// The prototype's drag-a-thumb-along-a-track "send" control. A tap also
// completes it immediately (same shortcut the prototype offers), which is
// what makes this reliably clickable from Playwright as well as draggable
// by a real user.
export function SlideToConfirm({ disabled, label = "เลื่อนเพื่อส่ง", onConfirm }: SlideToConfirmProps) {
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startXRef = useRef(0);
  const baseXRef = useRef(0);

  function commit() {
    setDragX(MAX_DRAG);
    setDragging(false);
    setTimeout(() => {
      onConfirm();
      setDragX(0);
    }, COMMIT_DELAY_MS);
  }

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (disabled) return;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    startXRef.current = event.clientX;
    baseXRef.current = dragX;
    setDragging(true);
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    const delta = event.clientX - startXRef.current;
    const next = Math.max(0, Math.min(MAX_DRAG, baseXRef.current + delta));
    setDragX(next);
  }

  function onPointerUp() {
    if (!dragging) return;
    if (dragX > MAX_DRAG * COMMIT_RATIO) {
      commit();
    } else {
      setDragX(0);
      setDragging(false);
    }
  }

  function onClick() {
    if (disabled || dragging) return;
    commit();
  }

  return (
    <div
      data-testid="slide-to-confirm"
      className={`slide-to-confirm ${disabled ? "slide-to-confirm--disabled" : ""}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onClick={onClick}
    >
      <div className="slide-to-confirm__label" style={{ opacity: Math.max(0, 1 - dragX / 120) }}>
        {label}
      </div>
      <div
        className="slide-to-confirm__thumb"
        style={{
          transform: `translateX(${dragX}px)`,
          transition: dragging ? "none" : "transform 0.25s ease",
        }}
      >
        ›
      </div>
    </div>
  );
}
