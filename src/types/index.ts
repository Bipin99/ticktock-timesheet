export type TimesheetStatus = "COMPLETED" | "INCOMPLETE" | "MISSING";

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Timesheet = {
  id: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
};

export type TimesheetEntry = {
  id: string;
  timesheetId: string;
  date: string;
  projectId: string;
  projectName: string;
  workType: string;
  description: string;
  hours: number;
};

export type TimesheetSummary = Timesheet & {
  dateRange: string;
  totalHours: number;
  status: TimesheetStatus;
  action: "View" | "Update" | "Create";
};

export type TimesheetDetail = TimesheetSummary & {
  entries: TimesheetEntry[];
  days: Array<{
    date: string;
    label: string;
    entries: TimesheetEntry[];
  }>;
};

export type Project = {
  id: string;
  name: string;
};

export type WorkType = {
  id: string;
  name: string;
};
