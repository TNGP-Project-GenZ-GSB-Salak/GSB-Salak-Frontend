import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

interface AppShellProps {
  children: ReactNode;
  showNav?: boolean;
}

// Sizing/centering lives in MobileViewport (mounted once around the whole
// router); this just adds bottom-nav clearance for pages that show it.
export function AppShell({ children, showNav = true }: AppShellProps) {
  return (
    <div className="flex flex-1 flex-col">
      <main className={`flex-1 ${showNav ? "pb-20" : ""}`}>{children}</main>
      {showNav && <BottomNav />}
    </div>
  );
}
