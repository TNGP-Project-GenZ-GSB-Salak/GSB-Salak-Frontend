import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  size?: "md" | "sm";
}

// Heights (48px primary / 44px secondary / 32px small) are the ones the
// prototype's Button call-sites actually use (hint-size="…,48px" etc.).
export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...rest
}: ButtonProps) {
  const base =
    "rounded-full text-center font-semibold transition disabled:cursor-not-allowed disabled:opacity-40";
  const sizeClass =
    size === "sm"
      ? "h-8 px-4 text-[14px]"
      : variant === "secondary"
        ? "w-full h-11 px-6 text-[15px]"
        : "w-full h-12 px-6 text-[15px]";
  const variantClass =
    variant === "primary"
      ? "text-white shadow-[0_4px_14px_rgba(216,49,82,0.35)]"
      : "bg-pastel-pink text-primary-dark";
  const style = variant === "primary" ? { backgroundImage: "var(--gradient-button)" } : undefined;

  return (
    <button className={`${base} ${sizeClass} ${variantClass} ${className}`} style={style} {...rest} />
  );
}
