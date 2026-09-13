import "server-only";

import { addDays } from "@/lib/date";
import type { Project, Timesheet, TimesheetEntry, User, WorkType } from "@/types";

export const users: User[] = [
  {
    id: "user-1",
    name: "John Doe",
    email: "name@example.com",
    password: "password123",
  },
];

export const projects: Project[] = [
  { id: "project-homepage", name: "Project Name" },
  { id: "project-mobile", name: "Mobile Redesign" },
  { id: "project-dashboard", name: "Dashboard UI" },
];

export const workTypes: WorkType[] = [
  { id: "bug-fixes", name: "Bug fixes" },
  { id: "feature-work", name: "Feature work" },
  { id: "research", name: "Research" },
  { id: "qa", name: "QA" },
];

export const timesheets: Timesheet[] = [
  { id: "week-1", weekNumber: 1, startDate: "2024-01-01", endDate: "2024-01-05" },
  { id: "week-2", weekNumber: 2, startDate: "2024-01-08", endDate: "2024-01-12" },
  { id: "week-3", weekNumber: 3, startDate: "2024-01-15", endDate: "2024-01-19" },
  { id: "week-4", weekNumber: 4, startDate: "2024-01-22", endDate: "2024-01-26" },
  { id: "week-5", weekNumber: 5, startDate: "2024-01-28", endDate: "2024-02-01" },
  { id: "week-6", weekNumber: 6, startDate: "2024-02-05", endDate: "2024-02-09" },
  { id: "week-7", weekNumber: 7, startDate: "2024-02-12", endDate: "2024-02-16" },
  { id: "week-8", weekNumber: 8, startDate: "2024-02-19", endDate: "2024-02-23" },
  { id: "week-9", weekNumber: 9, startDate: "2024-02-26", endDate: "2024-03-01" },
  { id: "week-10", weekNumber: 10, startDate: "2024-03-04", endDate: "2024-03-08" },
  { id: "week-11", weekNumber: 11, startDate: "2024-03-11", endDate: "2024-03-15" },
  { id: "week-12", weekNumber: 12, startDate: "2024-03-18", endDate: "2024-03-22" },
];

const completedWeek = (timesheetId: string, startDate: string): TimesheetEntry[] =>
  Array.from({ length: 10 }, (_, index) => ({
    id: `${timesheetId}-entry-${index + 1}`,
    timesheetId,
    date: addDays(startDate, Math.floor(index / 2)),
    projectId: "project-homepage",
    projectName: "Project Name",
    workType: index % 2 === 0 ? "Feature work" : "Bug fixes",
    description: "Homepage Development",
    hours: 4,
  }));

export const initialEntries: TimesheetEntry[] = [
  ...completedWeek("week-1", "2024-01-01"),
  ...completedWeek("week-2", "2024-01-08"),
  ...completedWeek("week-4", "2024-01-22"),
  ...completedWeek("week-6", "2024-02-05"),
  ...completedWeek("week-10", "2024-03-04"),
  ...completedWeek("week-12", "2024-03-18"),
  ...completedWeek("week-3", "2024-01-15").slice(0, 5),
  ...completedWeek("week-7", "2024-02-12").slice(0, 7),
  ...completedWeek("week-9", "2024-02-26").slice(0, 3),
  ...completedWeek("week-11", "2024-03-11").slice(0, 8),
];
