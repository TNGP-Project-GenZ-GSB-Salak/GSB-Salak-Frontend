import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as api from "../lib/api";
import { Button } from "../components/Button";
import { Field } from "./Login";

export function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await api.register({ username, password, full_name: fullName });
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "สมัครสมาชิกไม่สำเร็จ");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <h1 className="auth-page__title">สมัครสมาชิก</h1>
      <p className="auth-page__subtitle">
        สร้างบัญชีใหม่ — บัญชีเงินฝากและสลากดิจิทัลจะถูกจัดเตรียมโดยระบบหลังบ้านแยกต่างหาก
      </p>

      <form onSubmit={handleSubmit} className="auth-page__form">
        <Field
          label="ชื่อ-นามสกุล"
          value={fullName}
          onChange={setFullName}
          autoComplete="name"
          testId="full-name-input"
        />
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
          autoComplete="new-password"
          testId="password-input"
        />
        {error && (
          <p className="message" data-testid="message">
            {error}
          </p>
        )}
        <Button type="submit" disabled={submitting} data-testid="submit-button">
          {submitting ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
        </Button>
      </form>

      <p className="auth-page__footer">
        มีบัญชีอยู่แล้ว?{" "}
        <Link to="/login" className="auth-page__link">
          เข้าสู่ระบบ
        </Link>
      </p>
    </div>
  );
}
