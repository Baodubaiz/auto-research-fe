'use client';

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CheckboxProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ className, checked = false, onCheckedChange, disabled, ...props }, ref) => {
    return (
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        disabled={disabled}
        ref={ref}
        onClick={() => !disabled && onCheckedChange?.(!checked)}
        className={cn(
          "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center transition-colors",
          checked ? "bg-primary text-primary-foreground" : "bg-transparent",
          className
        )}
        {...props}
      >
        {checked && <Check className="h-3 w-3 stroke-[3]" />}
      </button>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }

