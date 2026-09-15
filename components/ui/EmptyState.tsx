import React from "react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
  return (
    <div className={twMerge(clsx("flex flex-col items-center justify-center p-12 text-center border border-dashed border-white/20 rounded-2xl bg-[#0a1020]/50 backdrop-blur-sm", className))}>
      {icon && (
        <div className="w-16 h-16 mb-6 rounded-2xl bg-white/5 border border-white/10 shadow-inner flex items-center justify-center text-gray-400">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-heading font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 max-w-sm mb-6 text-sm leading-relaxed">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
