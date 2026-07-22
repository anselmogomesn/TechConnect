"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "white" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  href?: string;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  children,
  className,
  disabled,
  loading,
  icon,
  fullWidth,
  ...props
}: ButtonProps) {
  const baseStyles =
    "btn inline-flex items-center justify-center gap-2 font-poppins font-semibold border-none rounded-[10px] cursor-pointer transition-all duration-300 no-underline whitespace-nowrap";

  const variants = {
    primary:
      "bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white shadow-[0_4px_15px_rgba(27,94,32,0.3)] hover:shadow-[0_6px_25px_rgba(27,94,32,0.4)] hover:-translate-y-0.5",
    secondary:
      "bg-transparent text-[#1B5E20] border-2 border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white hover:-translate-y-0.5",
    accent:
      "bg-gradient-to-r from-[#FF9800] to-[#F57C00] text-white shadow-[0_4px_15px_rgba(255,152,0,0.3)] hover:shadow-[0_6px_25px_rgba(255,152,0,0.4)] hover:-translate-y-0.5",
    white:
      "bg-white text-[#1B5E20] shadow-[0_4px_15px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_25px_rgba(0,0,0,0.15)] hover:-translate-y-0.5",
    ghost:
      "bg-transparent text-[#424242] hover:bg-gray-100 hover:text-[#1B5E20]",
    danger:
      "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-[0_4px_15px_rgba(239,68,68,0.3)] hover:shadow-[0_6px_25px_rgba(239,68,68,0.4)] hover:-translate-y-0.5",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-[0.9rem]",
    lg: "px-8 py-4 text-base",
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        (disabled || loading) && "opacity-60 cursor-not-allowed hover:transform-none",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : icon ? (
        icon
      ) : null}
      {children}
    </button>
  );
}
