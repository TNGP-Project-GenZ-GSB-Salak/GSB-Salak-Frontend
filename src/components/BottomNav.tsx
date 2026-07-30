import { NavLink } from "react-router-dom";

// Matches the prototype's tabsConfig exactly (5 tabs, "scan" raised as a
// FAB). Only หน้าหลัก/บัญชี/ตั้งค่า are wired — the prototype itself never
// wires สแกนจ่าย or ประวัติ either (tabbar only handles home/accounts taps),
// so those two stay inert here too rather than inventing new screens for them.
const TABS = [
  { key: "home", to: "/", label: "หน้าหลัก", icon: HomeIcon },
  { key: "accounts", to: "/accounts", label: "บัญชี", icon: WalletIcon },
  { key: "scan", label: "สแกนจ่าย", icon: ScanIcon, raised: true },
  { key: "history", label: "ประวัติ", icon: HistoryIcon },
  { key: "settings", to: "/settings", label: "ตั้งค่า", icon: GearIcon },
] as const;

export function BottomNav() {
  return (
    <nav className="bottom-nav">
      {TABS.map((tab) => (
        <NavTab key={tab.key} tab={tab} />
      ))}
    </nav>
  );
}

type Tab = (typeof TABS)[number];

function NavTab({ tab }: { tab: Tab }) {
  const Icon = tab.icon;
  const raised = "raised" in tab && tab.raised;

  if (!("to" in tab)) {
    return (
      <div data-testid={`nav-tab-${tab.key}`} aria-disabled="true" className="bottom-nav__tab bottom-nav__tab--inert">
        {raised ? (
          <span className="bottom-nav__fab">
            <Icon className="h-5 w-5" />
          </span>
        ) : (
          <Icon className="h-6 w-6" />
        )}
        {tab.label}
      </div>
    );
  }

  return (
    <NavLink
      to={tab.to}
      end={tab.to === "/"}
      data-testid={`nav-tab-${tab.key}`}
      className={({ isActive }) => `bottom-nav__tab ${isActive ? "bottom-nav__tab--active" : ""}`}
    >
      <Icon className="h-6 w-6" />
      {tab.label}
    </NavLink>
  );
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path d="M3 11.5 12 4l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 10v9h14v-9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WalletIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 10h18" />
      <path d="M15 14h3" strokeLinecap="round" />
    </svg>
  );
}

function ScanIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path d="M4 8V5a1 1 0 0 1 1-1h3M20 8V5a1 1 0 0 0-1-1h-3M4 16v3a1 1 0 0 0 1 1h3M20 16v3a1 1 0 0 1-1 1h-3" strokeLinecap="round" />
      <path d="M4 12h16" strokeLinecap="round" />
    </svg>
  );
}

function HistoryIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l3 2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 2h6" strokeLinecap="round" />
    </svg>
  );
}

function GearIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <circle cx="12" cy="12" r="3" />
      <path
        d="M19.4 13a7.97 7.97 0 0 0 0-2l2-1.5-2-3.5-2.4 1a8 8 0 0 0-1.7-1L15 3h-4l-.3 2a8 8 0 0 0-1.7 1l-2.4-1-2 3.5L6.6 11a7.97 7.97 0 0 0 0 2l-2 1.5 2 3.5 2.4-1a8 8 0 0 0 1.7 1L11 21h4l.3-2a8 8 0 0 0 1.7-1l2.4 1 2-3.5-2-1.5Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}
