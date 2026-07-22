import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function resolveImageUrl(url: string): string {
  if (!url) return url;
  const base = import.meta.env.BASE_URL || "/";
  if (url.startsWith("/uploads/")) {
    return base === "/" ? url : `${base.replace(/\/$/, "")}${url}`;
  }
  return url;
}
