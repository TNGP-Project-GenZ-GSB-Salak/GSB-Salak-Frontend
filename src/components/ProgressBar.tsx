interface ProgressBarProps {
  value: number;
  max: number;
}

export function ProgressBar({ value, max }: ProgressBarProps) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div className="progress-bar" data-testid="progress-bar">
      <div className="progress-bar__fill" style={{ width: `${pct}%` }} />
    </div>
  );
}
