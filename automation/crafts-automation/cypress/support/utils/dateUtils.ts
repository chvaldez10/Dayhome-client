/**
 * Returns an array of expected days in a given month and year.
 *
 * @param month - The month for which to get the days (1-12).
 * @param year - The year for which to get the days.
 * @returns An array of strings representing the days in the specified month.
 */
export function getExpectedDaysInMonth(month: number, year: number): string[] {
  const date = new Date(year, month - 1, 1);
  const days: string[] = [];
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  while (date.getMonth() === month - 1) {
    days.push(date.toLocaleDateString("en-US", options));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

/**
 * Gets the current date parameters including month index, month name, and year.
 *
 * @returns An object containing the current month index (1-12), month name, and year.
 */
export function getCurrentDateParams(): {
  monthIndex: number;
  monthName: string;
  year: number;
} {
  const now = new Date();
  const monthIndex = now.getMonth() + 1;
  const year = now.getFullYear();
  const monthName = now.toLocaleString("default", { month: "long" });
  return { monthIndex, monthName, year };
}
