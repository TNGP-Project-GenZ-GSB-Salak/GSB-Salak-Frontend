import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ children, className = "", ...rest }: CardProps) {
  return (
    <div
      className={`rounded-2xl bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.08)] ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
