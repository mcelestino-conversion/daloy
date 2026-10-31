import { LoaderCircle } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "icon";
  loading?: boolean;
  children: ReactNode;
};

const variants = {
  primary: "border-sandstone bg-sandstone text-background hover:bg-ivory",
  secondary: "border-border bg-elevated text-ivory hover:border-[#5a564f] hover:bg-surface",
  ghost: "border-transparent bg-transparent text-taupe hover:bg-surface hover:text-ivory",
  danger: "border-[#6b4b48] bg-[#2b211f] text-[#f0c9c4] hover:bg-[#362724]",
};

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  icon: "size-10 p-0",
};

export function Button({ variant = "secondary", size = "md", loading = false, className = "", disabled, children, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-[9px] border font-medium transition duration-150 focus-visible:outline-2 focus-visible:outline-sandstone disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : null}
      {children}
    </button>
  );
}
