import { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge(clsx("animate-pulse rounded-md bg-white/10", className))}
      {...props}
    />
  );
}
