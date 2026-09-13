import "server-only";

import { initialEntries, projects, timesheets, users, workTypes } from "@/lib/mock-data";
import { formatDateRange, formatDayLabel, getWeekDays, rangesOverlap } from "@/lib/date";
import type {
  Project,
  TimesheetDetail,
  TimesheetEntry,
  TimesheetStatus,
  TimesheetSummary,
  User,
  WorkType,
} from "@/types";

const entries: TimesheetEntry[] = [...initialEntries];

function totalHours(timesheetId: string) {
  return entries
    .filter((entry) => entry.timesheetId === timesheetId)
    .reduce((sum, entry) => sum + entry.hours, 0);
}

export function getStatus(hours: number): TimesheetStatus {
  if (hours === 0) {
    return "MISSING";
  }

  if (hours < 40) {
    return "INCOMPLETE";
  }

  return "COMPLETED";
}

function getAction(status: TimesheetStatus): TimesheetSummary["action"] {
  if (status === "MISSING") {
    return "Create";
  }

  if (status === "INCOMPLETE") {
    return "Update";
  }

  return "View";
}

function toSummary(timesheetId: string): TimesheetSummary | null {
  const timesheet = timesheets.find((item) => item.id === timesheetId);

  if (!timesheet) {
    return null;
  }

  const hours = totalHours(timesheet.id);
  const status = getStatus(hours);

  return {
    ...timesheet,
    dateRange: formatDateRange(timesheet.startDate, timesheet.endDate),
    totalHours: hours,
    status,
    action: getAction(status),
  };
}

export function findUserByCredentials(email: string, password: string): User | null {
  return users.find((user) => user.email === email && user.password === password) ?? null;
}

export function listOptions(): { projects: Project[]; workTypes: WorkType[] } {
  return { projects, workTypes };
}

export function listTimesheets(params: {
  page?: number;
  perPage?: number;
  status?: TimesheetStatus | "ALL";
  dateFrom?: string | null;
  dateTo?: string | null;
}) {
  const page = Math.max(params.page ?? 1, 1);
  const perPage = Math.max(params.perPage ?? 5, 1);

  let summaries = timesheets
    .map((timesheet) => toSummary(timesheet.id))
    .filter((timesheet): timesheet is TimesheetSummary => Boolean(timesheet))
    .filter((timesheet) => rangesOverlap(timesheet.startDate, timesheet.endDate, params.dateFrom, params.dateTo));

  if (params.status && params.status !== "ALL") {
    summaries = summaries.filter((timesheet) => timesheet.status === params.status);
  }

  summaries = summaries.sort((left, right) => left.weekNumber - right.weekNumber);

  const total = summaries.length;
  const totalPages = Math.max(Math.ceil(total / perPage), 1);
  const start = (page - 1) * perPage;

  return {
    data: summaries.slice(start, start + perPage),
    meta: {
      page,
      perPage,
      total,
      totalPages,
    },
  };
}

export function getTimesheetDetail(timesheetId: string): TimesheetDetail | null {
  const summary = toSummary(timesheetId);

  if (!summary) {
    return null;
  }

  const weekEntries = entries
    .filter((entry) => entry.timesheetId === timesheetId)
    .sort((left, right) => left.date.localeCompare(right.date));

  return {
    ...summary,
    entries: weekEntries,
    days: getWeekDays(summary.startDate, summary.endDate).map((date) => ({
      date,
      label: formatDayLabel(date),
      entries: weekEntries.filter((entry) => entry.date === date),
    })),
  };
}

export function createEntry(input: Omit<TimesheetEntry, "id" | "projectName">): TimesheetEntry {
  const project = projects.find((item) => item.id === input.projectId);

  const entry: TimesheetEntry = {
    ...input,
    id: `entry-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    projectName: project?.name ?? "Project Name",
  };

  entries.push(entry);
  return entry;
}

export function updateEntry(
  timesheetId: string,
  entryId: string,
  input: Omit<TimesheetEntry, "id" | "timesheetId" | "projectName">,
): TimesheetEntry | null {
  const index = entries.findIndex((entry) => entry.id === entryId && entry.timesheetId === timesheetId);

  if (index === -1) {
    return null;
  }

  const project = projects.find((item) => item.id === input.projectId);

  entries[index] = {
    ...entries[index],
    ...input,
    projectName: project?.name ?? "Project Name",
  };

  return entries[index];
}

export function deleteEntry(timesheetId: string, entryId: string) {
  const index = entries.findIndex((entry) => entry.id === entryId && entry.timesheetId === timesheetId);

  if (index === -1) {
    return false;
  }

  entries.splice(index, 1);
  return true;
}
