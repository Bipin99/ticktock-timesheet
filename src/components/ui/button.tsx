import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium transition disabled:opacity-60",
        variant === "primary" && "bg-brand text-white hover:bg-brand-hover",
        variant === "secondary" && "border border-line bg-white text-ink hover:bg-gray-50",
        variant === "ghost" && "text-muted hover:bg-gray-100 hover:text-ink",
        className,
      )}
      {...props}
    />
  );
}
