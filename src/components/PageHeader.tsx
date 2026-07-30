import { useNavigate } from "react-router-dom";

export function PageHeader({ title, onBack }: { title: string; onBack?: () => void }) {
  const navigate = useNavigate();
  return (
    <header className="flex items-center gap-3 bg-white px-4 py-4 shadow-sm">
      <button
        type="button"
        onClick={onBack ?? (() => navigate(-1))}
        aria-label="ย้อนกลับ"
        className="flex h-8 w-8 items-center justify-center rounded-full text-ink"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
          <path d="m15 6-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <h1 className="text-base font-semibold text-ink">{title}</h1>
    </header>
  );
}
