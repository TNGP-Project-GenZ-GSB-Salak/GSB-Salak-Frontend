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
    <div className="app-shell">
      <main className={`app-shell__main ${showNav ? "app-shell__main--with-nav" : ""}`}>{children}</main>
      {showNav && <BottomNav />}
    </div>
  );
}
