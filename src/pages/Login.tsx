import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/Button";

export function Login() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const result = await api.login({ username, password });
      auth.login(result.token, result.user);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "เข้าสู่ระบบไม่สำเร็จ");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col justify-center px-6">
      <h1 className="mb-1 text-2xl font-bold text-primary-dark">Digital Salak</h1>
      <p className="mb-8 text-sm text-neutral">เข้าสู่ระบบเพื่อจัดการสลากดิจิทัลของคุณ</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="ชื่อผู้ใช้" value={username} onChange={setUsername} autoComplete="username" />
        <Field
          label="รหัสผ่าน"
          value={password}
          onChange={setPassword}
          type="password"
          autoComplete="current-password"
        />
        {error && <p className="text-sm text-error">{error}</p>}
        <Button type="submit" disabled={submitting}>
          {submitting ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-neutral">
        ยังไม่มีบัญชี?{" "}
        <Link to="/register" className="font-semibold text-primary">
          สมัครสมาชิก
        </Link>
      </p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-ink">{label}</span>
      <input
        type={type}
        required
        value={value}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-neutral-lighter bg-white px-4 py-3 text-sm outline-none focus:border-primary"
      />
    </label>
  );
}

export { Field };
