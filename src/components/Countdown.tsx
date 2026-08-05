import { useEffect, useRef, useState } from "react";

interface CountdownProps {
  // Seconds remaining, as reported by the server just now - never a
  // client-computed deadline. The configured countdown duration itself is
  // never exposed to the client; this is the only number it ever sees.
  remainingSeconds: number;
  onExpire?: () => void;
}

function format(remainingMs: number): string {
  const total = Math.max(0, Math.floor(remainingMs / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

// Self-ticking countdown anchored on remainingSeconds - elapsed real time
// since the anchor, not an absolute deadline (whose accuracy would depend
// on the device's own clock). Anchors on mount and re-anchors every time
// remainingSeconds changes (a caller's fresh poll), so client/server drift
// never accumulates past one poll interval, and a shortened demo duration
// doesn't make a fixed clock-skew assumption proportionally worse.
export function Countdown({ remainingSeconds, onExpire }: CountdownProps) {
  const anchorRef = useRef({ atMs: Date.now(), remainingSeconds });
  const firedRef = useRef(false);
  const [remainingMs, setRemainingMs] = useState(() => remainingSeconds * 1000);

  useEffect(() => {
    anchorRef.current = { atMs: Date.now(), remainingSeconds };
    firedRef.current = false;
    setRemainingMs(remainingSeconds * 1000);
  }, [remainingSeconds]);

  useEffect(() => {
    const id = window.setInterval(() => {
      const elapsed = Date.now() - anchorRef.current.atMs;
      const next = anchorRef.current.remainingSeconds * 1000 - elapsed;
      setRemainingMs(next);
      if (next <= 0 && !firedRef.current) {
        firedRef.current = true;
        onExpire?.();
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [onExpire]);

  return (
    <span data-testid="goal-countdown" className="countdown">
      {format(remainingMs)}
    </span>
  );
}
