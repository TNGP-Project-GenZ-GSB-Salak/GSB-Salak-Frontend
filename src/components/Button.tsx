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
  return (
    <button
      className={`btn btn--${size} btn--${variant} ${className}`}
      {...rest}
    />
  );
}
