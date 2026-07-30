import type { ReactNode } from "react";

// Constrains the whole app to a phone-width column, centered on wider
// screens — no device bezel/notch, just the size. On an actual mobile
// browser (viewport <= max-w-md) this is indistinguishable from full-bleed.
export function MobileViewport({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full justify-center bg-[#e2e2e6]">
      <div className="flex w-full max-w-md flex-col bg-app-bg shadow-[0_0_40px_rgba(0,0,0,0.08)]">
        {children}
      </div>
    </div>
  );
}
