import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Standard Pakistani Rupee (PKR) formatting
 * Formats numbers into PKR 5,150,000 pattern
 */
export function formatPKR(amount: number): string {
  if (isNaN(amount)) return "PKR 0";
  return `PKR ${new Intl.NumberFormat("en-PK").format(amount)}`;
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-PK", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}
