import { ChevronDown } from "lucide-react";
import type { InputHTMLAttributes, LabelHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("text-xs font-semibold text-ink", className)} {...props} />;
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-md border border-line bg-white px-3 text-sm text-ink shadow-sm placeholder:text-gray-400 focus:border-brand",
        className,
      )}
      {...props}
    />
  );
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative w-full">
      <select
        className={cn(
          "h-10 w-full appearance-none rounded-md border border-line bg-white py-2 pr-9 pl-3 text-sm text-ink shadow-sm focus:border-brand",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
    </div>
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-32 w-full resize-none rounded-md border border-line bg-white px-3 py-3 text-sm text-ink shadow-sm placeholder:text-gray-400 focus:border-brand",
        className,
      )}
      {...props}
    />
  );
}

export function FieldError({ children }: { children?: string }) {
  if (!children) {
    return null;
  }

  return <p className="mt-1 text-xs font-medium text-red-600">{children}</p>;
}
