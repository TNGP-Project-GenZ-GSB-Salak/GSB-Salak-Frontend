import { useNavigate } from "react-router-dom";

interface PageHeaderProps {
  title: string;
  variant?: "close" | "back" | "plain";
  onAction?: () => void;
}

// Two real header patterns from the prototype: a "close" (✕) header used
// entering a flow, and a "back" (‹) header used mid-flow (e.g. Confirm).
// "plain" is the terminal/success variant — spacer + centered title, no icon.
export function PageHeader({ title, variant = "back", onAction }: PageHeaderProps) {
  const navigate = useNavigate();
  const handleAction = onAction ?? (() => navigate(-1));

  if (variant === "back") {
    return (
      <header className="flex items-center bg-white px-2 pb-2 pt-7">
        <button
          type="button"
          onClick={handleAction}
          aria-label="ย้อนกลับ"
          data-testid="back-button"
          className="flex h-10 w-10 shrink-0 items-center justify-center text-ink"
        >
          <BackIcon className="h-[22px] w-[22px]" />
        </button>
        <h1 className="mr-10 flex-1 text-center text-[17px] font-bold text-ink">{title}</h1>
      </header>
    );
  }

  return (
    <header className="flex items-center bg-white px-2 pb-2 pt-7">
      <div className="h-10 w-10 shrink-0" />
      <h1 className="flex-1 text-center text-[18px] font-bold text-ink">{title}</h1>
      {variant === "close" ? (
        <button
          type="button"
          onClick={handleAction}
          aria-label="ปิด"
          data-testid="back-button"
          className="flex h-10 w-10 shrink-0 items-center justify-center text-ink"
        >
          <CloseIcon className="h-7 w-7" />
        </button>
      ) : (
        <div className="h-10 w-10 shrink-0" />
      )}
    </header>
  );
}

function BackIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path d="m15 6-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
