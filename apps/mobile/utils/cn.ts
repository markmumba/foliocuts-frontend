import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes
 * Same as the web app's cn utility
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

