import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const PALETTE = [
  "hsl(var(--chart-1))", // teal
  "hsl(var(--chart-2))", // orange
  "hsl(var(--chart-3))", // violet
  "hsl(var(--chart-4))", // pink
  "hsl(var(--chart-5))", // lime
  "hsl(var(--chart-6))", // amber
  "hsl(var(--chart-7))", // indigo
] as const;
