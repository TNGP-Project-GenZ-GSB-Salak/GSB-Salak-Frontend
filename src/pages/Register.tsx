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
    <div className="flex flex-1 flex-col justify-center px-6">
      <h1 className="mb-1 text-2xl font-bold text-primary-dark">สมัครสมาชิก</h1>
      <p className="mb-8 text-sm text-neutral">
        สร้างบัญชีใหม่ — บัญชีเงินฝากและสลากดิจิทัลจะถูกจัดเตรียมโดยระบบหลังบ้านแยกต่างหาก
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="ชื่อ-นามสกุล" value={fullName} onChange={setFullName} autoComplete="name" />
        <Field label="ชื่อผู้ใช้" value={username} onChange={setUsername} autoComplete="username" />
        <Field
          label="รหัสผ่าน"
          value={password}
          onChange={setPassword}
          type="password"
          autoComplete="new-password"
        />
        {error && <p className="text-sm text-error">{error}</p>}
        <Button type="submit" disabled={submitting}>
          {submitting ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-neutral">
        มีบัญชีอยู่แล้ว?{" "}
        <Link to="/login" className="font-semibold text-primary">
          เข้าสู่ระบบ
        </Link>
      </p>
    </div>
  );
}
