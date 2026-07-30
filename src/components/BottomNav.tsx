import { NavLink } from "react-router-dom";

const TABS = [
  { to: "/", label: "หน้าหลัก", icon: HomeIcon },
  { to: "/salak", label: "สลากดิจิทัล", icon: TicketIcon },
];

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 mx-auto flex w-full max-w-md items-center justify-around border-t border-neutral-lighter bg-white py-2">
      {TABS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 px-4 py-1 text-xs font-medium ${
              isActive ? "text-primary" : "text-neutral"
            }`
          }
        >
          <Icon className="h-6 w-6" />
          {label}
        </NavLink>
      ))}
    </nav>
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

function TicketIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path
        d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4Z"
        strokeLinejoin="round"
      />
      <path d="M10 6v12" strokeDasharray="2 2" />
    </svg>
  );
}
