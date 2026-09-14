import { InputHTMLAttributes, forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={twMerge(clsx(
          "flex h-12 w-full rounded-xl bg-black/40 border px-4 py-2 text-sm text-white placeholder:text-gray-500",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-navy-900 transition-colors disabled:cursor-not-allowed disabled:opacity-50",
          error 
            ? "border-red-500 focus:ring-red-500 focus:border-red-500" 
            : "border-white/10 focus:border-electric-blue focus:ring-electric-blue/50",
          className
        ))}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export const Label = forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={twMerge(clsx("text-sm font-medium leading-none text-gray-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className))}
      {...props}
    />
  )
);
Label.displayName = "Label";
