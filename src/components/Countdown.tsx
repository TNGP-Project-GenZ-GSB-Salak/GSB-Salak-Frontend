import { useEffect, useRef, useState } from "react";

interface CountdownProps {
  deadline: string;
  onExpire?: () => void;
}

function format(remainingMs: number): string {
  const total = Math.max(0, Math.floor(remainingMs / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

// Self-ticking countdown to `deadline` (an ISO timestamp) — elapsed-time-based, so no
// timezone conversion is needed even though the customer reads it in UTC+7.
export function Countdown({ deadline, onExpire }: CountdownProps) {
  const target = new Date(deadline).getTime();
  const [remaining, setRemaining] = useState(() => target - Date.now());
  const firedRef = useRef(false);

  useEffect(() => {
    const id = window.setInterval(() => {
      const next = target - Date.now();
      setRemaining(next);
      if (next <= 0 && !firedRef.current) {
        firedRef.current = true;
        onExpire?.();
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [target, onExpire]);

  return (
    <span data-testid="goal-countdown" className="countdown">
      {format(remaining)}
    </span>
  );
}
