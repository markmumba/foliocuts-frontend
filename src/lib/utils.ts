import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a role name by replacing underscores with spaces
 * @param role - The role string (e.g., "SERVICE_GIRL")
 * @returns Formatted role string (e.g., "SERVICE GIRL")
 */
export function formatRole(role: string): string {
  return role.replace(/_/g, " ")
}
