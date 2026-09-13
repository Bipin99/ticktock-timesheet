"use client";

import { EllipsisVertical, Plus } from "lucide-react";
import { useEffect, useState } from "react";

import { EntryModal } from "@/components/timesheet/entry-modal";
import { Button } from "@/components/ui/button";
import { apiDelete, apiGet } from "@/lib/api-client";
import type { Project, TimesheetDetail, TimesheetEntry, WorkType } from "@/types";

type DetailResponse = {
  data: TimesheetDetail;
  options: {
    projects: Project[];
    workTypes: WorkType[];
  };
};

export function WeekDetail({ timesheetId }: { timesheetId: string }) {
  const [timesheet, setTimesheet] = useState<TimesheetDetail | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [workTypes, setWorkTypes] = useState<WorkType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalDate, setModalDate] = useState("");
  const [editingEntry, setEditingEntry] = useState<TimesheetEntry | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  async function load() {
    const result = await apiGet<DetailResponse>(`/api/timesheets/${timesheetId}`);

    if (!result.ok) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setTimesheet(result.data.data);
    setProjects(result.data.options.projects);
    setWorkTypes(result.data.options.workTypes);
    setLoading(false);
  }

  useEffect(() => {
    // Load timesheet detail from the internal API on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timesheetId]);

  async function deleteTask(entryId: string) {
    const result = await apiDelete<{ timesheet: TimesheetDetail }>(`/api/timesheets/${timesheetId}/entries/${entryId}`);

    if (result.ok && result.data.timesheet) {
      setTimesheet(result.data.timesheet);
    }

    setOpenMenuId(null);
  }

  if (loading) {
    return <DetailState>Loading timesheet...</DetailState>;
  }

  if (error || !timesheet) {
    return (
      <DetailState>
        <p>{error || "Timesheet not found."}</p>
        <Button
          type="button"
          className="mt-4"
          onClick={() => {
            setLoading(true);
            setError("");
            load();
          }}
        >
          Try again
        </Button>
      </DetailState>
    );
  }

  const percent = Math.min(Math.round((timesheet.totalHours / 40) * 100), 100);

  return (
    <section className="rounded-md border border-line bg-white px-4 py-6 shadow-sm sm:px-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold leading-6 text-ink">This week&apos;s timesheet</h1>
          <p className="mt-6 text-sm font-normal leading-[150%] text-muted">{timesheet.dateRange}</p>
        </div>
        <div className="w-full max-w-[240px]">
          <div className="relative pt-10">
            <div
              className="absolute top-0 -translate-x-1/2"
              style={{ left: `min(max(${percent}%, 20%), 70%)` }}
            >
              <div className="rounded-md border border-line bg-white px-2.5 py-1 shadow-sm">
                <p className="whitespace-nowrap text-center text-sm font-medium leading-[150%] text-ink">
                  {timesheet.totalHours}/40 hrs
                </p>
              </div>
              <div className="mx-auto h-0 w-0 border-x-[6px] border-t-[6px] border-x-transparent border-t-line" />
              <div className="mx-auto -mt-[7px] h-0 w-0 border-x-[5px] border-t-[5px] border-x-transparent border-t-white" />
            </div>

            <div className="flex items-center gap-2">
              <div className="h-2 flex-1 rounded-full bg-[#E5E7EB]">
                <div className="h-2 rounded-full bg-progress" style={{ width: `${percent}%` }} />
              </div>
              <span className="shrink-0 text-right text-xs font-medium leading-[150%] text-muted">100%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {timesheet.days.map((day) => (
          <div key={day.date} className="grid gap-3 md:grid-cols-[90px_1fr]">
            <p className="pt-2 text-lg font-semibold leading-[150%] text-ink">{day.label}</p>
            <div className="space-y-2">
              {day.entries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between gap-4 rounded-lg border border-line bg-white px-4 py-2.5"
                >
                  <p className="min-w-0 flex-1 truncate text-base font-medium leading-[150%] text-ink">
                    {entry.description}
                  </p>
                  <div className="flex shrink-0 items-center gap-3">
                    <p className="text-base font-medium leading-[150%] text-[#9CA3AF]">{entry.hours} hrs</p>
                    <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-center text-xs font-medium leading-[150%] text-brand-deep">
                      {entry.projectName}
                    </span>
                    <div className="relative">
                      <button
                        type="button"
                        className="rounded p-1 text-[#9CA3AF] hover:bg-gray-100"
                        onClick={() => setOpenMenuId((value) => (value === entry.id ? null : entry.id))}
                        aria-label="Entry actions"
                      >
                        <EllipsisVertical className="h-4 w-4" strokeWidth={2} />
                      </button>
                      {openMenuId === entry.id ? (
                        <div className="absolute right-0 z-10 mt-1 w-24 rounded-md border border-line bg-white p-1 shadow-lg">
                          <button
                            type="button"
                            className="w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-50"
                            onClick={() => {
                              setEditingEntry(entry);
                              setModalDate(entry.date);
                              setOpenMenuId(null);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="w-full rounded px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                            onClick={() => deleteTask(entry.id)}
                          >
                            Delete
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 p-1 text-base font-medium leading-[150%] text-muted transition hover:border-brand-strong hover:bg-brand-soft hover:text-brand-strong"
                onClick={() => {
                  setEditingEntry(null);
                  setModalDate(day.date);
                }}
              >
                <Plus className="h-3.5 w-3.5" />
                Add new task
              </button>
            </div>
          </div>
        ))}
      </div>

      <EntryModal
        open={Boolean(modalDate)}
        timesheetId={timesheet.id}
        date={modalDate}
        entry={editingEntry}
        projects={projects}
        workTypes={workTypes}
        onClose={() => {
          setModalDate("");
          setEditingEntry(null);
        }}
        onSaved={setTimesheet}
      />
    </section>
  );
}

function DetailState({ children }: { children: React.ReactNode }) {
  return (
    <section className="rounded-md border border-line bg-white px-6 py-16 text-center text-sm text-gray-500 shadow-sm">
      {children}
    </section>
  );
}
