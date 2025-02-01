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
