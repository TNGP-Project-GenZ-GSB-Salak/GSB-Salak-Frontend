import { useAuth } from "../context/AuthContext";
import { AppShell } from "../components/AppShell";
import { PageHeader } from "../components/PageHeader";
import { Card } from "../components/Card";
import { Button } from "../components/Button";

// The prototype's "ตั้งค่า" tab is unwired (decorative). Session/account
// management has to live somewhere, so it's the natural home for logout
// rather than an "additional feature" — not a new gamification screen, just
// where a real app would put it.
export function Settings() {
  const { user, logout } = useAuth();

  return (
    <AppShell>
      <PageHeader title="ตั้งค่า" variant="plain" />
      <div className="flex flex-col gap-4 p-4">
        <Card className="settings-user-card">
          <p className="settings-user-card__name">{user?.full_name ?? user?.username}</p>
          <p className="settings-user-card__username">@{user?.username}</p>
        </Card>
        <Button variant="secondary" onClick={logout} data-testid="logout-button">
          ออกจากระบบ
        </Button>
      </div>
    </AppShell>
  );
}
