import type { ReactNode } from "react";

// Constrains the whole app to a phone-width column, centered on wider
// screens — no device bezel/notch, just the size. On an actual mobile
// browser (viewport <= max-w-md) this is indistinguishable from full-bleed.
export function MobileViewport({ children }: { children: ReactNode }) {
  return (
    <div className="mobile-viewport">
      <div className="mobile-viewport__inner">{children}</div>
    </div>
  );
}
