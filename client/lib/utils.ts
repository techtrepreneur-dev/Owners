import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatEnumString(str: string) {
  return str.replace(/([A-Z])/g, " $1").trim();
}

export function formatPriceValue(value: number | null, isMin: boolean) {
  if (value === null || value === 0)
    return isMin ? "Any Min Price" : "Any Max Price";
  if (value >= 1000) {
    const kValue = value / 1000;
    return isMin ? `$${kValue}k+` : `<$${kValue}k`;
  }
  return isMin ? `$${value}+` : `<$${value}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function cleanParams(params: Record<string, any>): Record<string, any> {
  return Object.fromEntries(
    Object.entries(params).filter(
      (
        [_, value] // eslint-disable-line @typescript-eslint/no-unused-vars
      ) =>
        value !== undefined &&
        value !== "any" &&
        value !== "" &&
        (Array.isArray(value) ? value.some((v) => v !== null) : value !== null)
    )
  );
}

type MutationMessages = {
  success?: string;
  error: string;
};

export const withToast = async <T>(
  mutationFn: Promise<T>,
  messages: Partial<MutationMessages>
) => {
  const { success, error } = messages;

  try {
    const result = await mutationFn;
    if (success) toast.success(success);
    return result;
  } catch (err) {
    if (error) toast.error(error);
    throw err;
  }
};

// Helper function to categorize the date
export function getDayCategory(dateString: string): 'today' | 'yesterday' | 'this_week' | 'older' {
  const appDate = new Date(dateString);
  const now = new Date();

  // Extract year, month, and date in UTC to match the Prisma string
  const appDay = Date.UTC(appDate.getUTCFullYear(), appDate.getUTCMonth(), appDate.getUTCDate());

  // Extract today's date in UTC
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());

  // 24 hours in milliseconds
  const oneDayMs = 24 * 60 * 60 * 1000;
  const yesterday = today - oneDayMs;

  // Calculate the start of the current week in UTC (Sunday as start of week)
  const startOfWeek = today - (now.getUTCDay() * oneDayMs);

  if (appDay === today) {
    return 'today';
  } else if (appDay === yesterday) {
    return 'yesterday';
  } else if (appDay < yesterday && appDay >= startOfWeek) {
    return 'this_week';
  } else {
    return 'older';
  }
}