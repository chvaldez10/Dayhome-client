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

export function getCurrentDateParams(): {
  monthIndex: number;
  year: number;
  monthName: string;
} {
  const now = new Date();
  const monthIndex = now.getMonth() + 1;
  const year = now.getFullYear();
  const monthName = now.toLocaleString("default", { month: "long" });
  return { monthIndex, year, monthName };
}
