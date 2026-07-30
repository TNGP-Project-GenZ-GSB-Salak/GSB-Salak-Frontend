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
    <div className="auth-page">
      <h1 className="auth-page__title">Digital Salak</h1>
      <p className="auth-page__subtitle">เข้าสู่ระบบเพื่อจัดการสลากดิจิทัลของคุณ</p>

      <form onSubmit={handleSubmit} className="auth-page__form">
        <Field
          label="ชื่อผู้ใช้"
          value={username}
          onChange={setUsername}
          autoComplete="username"
          testId="username-input"
        />
        <Field
          label="รหัสผ่าน"
          value={password}
          onChange={setPassword}
          type="password"
          autoComplete="current-password"
          testId="password-input"
        />
        {error && (
          <p className="message" data-testid="message">
            {error}
          </p>
        )}
        <Button type="submit" disabled={submitting} data-testid="submit-button">
          {submitting ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </Button>
      </form>

      <p className="auth-page__footer">
        ยังไม่มีบัญชี?{" "}
        <Link to="/register" className="auth-page__link">
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
  testId,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
  testId?: string;
}) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      <input
        type={type}
        required
        value={value}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
        data-testid={testId}
        className="field__input"
      />
    </label>
  );
}

export { Field };
