const formatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const shortFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
});

/** Local calendar date key — avoids UTC shift from toISOString() in IST etc. */
export function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addDays(dateKey: string, days: number) {
  const date = new Date(`${dateKey}T12:00:00`);
  date.setDate(date.getDate() + days);
  return toDateKey(date);
}

export function formatDateRange(startDate: string, endDate: string) {
  const start = new Date(`${startDate}T12:00:00`);
  const end = new Date(`${endDate}T12:00:00`);
  const sameMonth = start.getMonth() === end.getMonth();
  const sameYear = start.getFullYear() === end.getFullYear();

  const startDay = start.getDate();
  const endDay = end.getDate();
  const startMonth = start.toLocaleString("en-GB", { month: "long" });
  const endMonth = end.toLocaleString("en-GB", { month: "long" });

  if (sameMonth && sameYear) {
    return `${startDay} - ${endDay} ${startMonth}, ${start.getFullYear()}`;
  }

  if (sameYear) {
    return `${startDay} ${startMonth} - ${endDay} ${endMonth}, ${start.getFullYear()}`;
  }

  return `${formatter.format(start)} - ${formatter.format(end)}`;
}

export function formatDayLabel(date: string) {
  return shortFormatter.format(new Date(`${date}T12:00:00`));
}

export function getWeekDays(startDate: string, endDate: string) {
  const days: string[] = [];
  let cursor = startDate;

  while (cursor <= endDate) {
    days.push(cursor);
    cursor = addDays(cursor, 1);
  }

  return days;
}

export function rangesOverlap(
  startA: string,
  endA: string,
  startB?: string | null,
  endB?: string | null,
) {
  if (!startB || !endB) {
    return true;
  }

  return startA <= endB && startB <= endA;
}
