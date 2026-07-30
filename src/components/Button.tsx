import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export function Button({ variant = "primary", className = "", ...rest }: ButtonProps) {
  const base =
    "w-full rounded-full px-6 py-3 text-center text-[15px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-40";
  const variantClass =
    variant === "primary"
      ? "text-white shadow-[0_4px_14px_rgba(216,49,82,0.35)]"
      : "bg-pastel-pink text-primary-dark";
  const style = variant === "primary" ? { backgroundImage: "var(--gradient-button)" } : undefined;

  return <button className={`${base} ${variantClass} ${className}`} style={style} {...rest} />;
}
