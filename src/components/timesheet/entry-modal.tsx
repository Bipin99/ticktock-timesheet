"use client";

import { X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { FieldError, Label, Select, Textarea } from "@/components/ui/form";
import { apiPost, apiPut } from "@/lib/api-client";
import { entrySchema } from "@/lib/validations";
import type { Project, TimesheetDetail, TimesheetEntry, WorkType } from "@/types";

type EntryModalProps = {
  open: boolean;
  timesheetId: string;
  date: string;
  entry?: TimesheetEntry | null;
  projects: Project[];
  workTypes: WorkType[];
  onClose: () => void;
  onSaved: (timesheet: TimesheetDetail) => void;
};

type FieldErrors = Partial<Record<"date" | "projectId" | "workType" | "description" | "hours", string>>;

export function EntryModal({
  open,
  timesheetId,
  date,
  entry,
  projects,
  workTypes,
  onClose,
  onSaved,
}: EntryModalProps) {
  if (!open) {
    return null;
  }

  return (
    <EntryModalContent
      key={`${entry?.id ?? "new"}-${date}`}
      timesheetId={timesheetId}
      date={date}
      entry={entry}
      projects={projects}
      workTypes={workTypes}
      onClose={onClose}
      onSaved={onSaved}
    />
  );
}

function FieldLabel({
  htmlFor,
  children,
  withInfo = false,
}: {
  htmlFor?: string;
  children: React.ReactNode;
  withInfo?: boolean;
}) {
  return (
    <Label htmlFor={htmlFor} className="inline-flex items-center text-sm font-medium leading-[150%] text-ink">
      {children}
      {withInfo ? (
        <span
          className="ml-2 inline-flex h-3 w-3 shrink-0 items-center justify-center rounded-full border border-[#9CA3AF] bg-[#9CA3AF] text-[8px] leading-none font-semibold text-white"
          aria-hidden
        >
          i
        </span>
      ) : null}
    </Label>
  );
}

function EntryModalContent({
  timesheetId,
  date,
  entry,
  projects,
  workTypes,
  onClose,
  onSaved,
}: Omit<EntryModalProps, "open">) {
  const [projectId, setProjectId] = useState(entry?.projectId ?? projects[0]?.id ?? "");
  const [workType, setWorkType] = useState(entry?.workType ?? workTypes[0]?.name ?? "");
  const [description, setDescription] = useState(entry?.description ?? "");
  const [hours, setHours] = useState(entry?.hours ?? 12);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const isEditing = Boolean(entry);

  async function submit() {
    const parsed = entrySchema.safeParse({
      date,
      projectId,
      workType,
      description,
      hours,
    });

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors({
        date: fieldErrors.date?.[0],
        projectId: fieldErrors.projectId?.[0],
        workType: fieldErrors.workType?.[0],
        description: fieldErrors.description?.[0],
        hours: fieldErrors.hours?.[0],
      });
      return;
    }

    setSaving(true);
    setFormError("");
    const result = entry
      ? await apiPut<{ timesheet: TimesheetDetail }>(
          `/api/timesheets/${timesheetId}/entries/${entry.id}`,
          parsed.data,
        )
      : await apiPost<{ timesheet: TimesheetDetail }>(`/api/timesheets/${timesheetId}/entries`, parsed.data);
    setSaving(false);

    if (!result.ok || !result.data.timesheet) {
      setFormError(result.ok ? "Unable to save entry." : result.error);
      return;
    }

    onSaved(result.data.timesheet);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#33363F]/90 px-4 py-8" onClick={onClose}>
      <div
        className="w-full max-w-[646px] overflow-hidden rounded-lg border border-line bg-white"
        role="dialog"
        aria-modal="true"
        aria-labelledby="entry-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-line py-5 pr-5 pl-5">
          <h2 id="entry-modal-title" className="text-lg font-semibold leading-[150%] text-ink">
            {isEditing ? "Edit Entry" : "Add New Entry"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-[#9CA3AF] hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="h-[11px] w-[11px]" strokeWidth={2.5} />
          </button>
        </div>

        <div className="space-y-4 px-5 py-5">
          <div>
            <FieldLabel htmlFor="project" withInfo>
              Select Project *
            </FieldLabel>
            <div className="mt-2 w-full max-w-[364px]">
              <Select
                id="project"
                value={projectId}
                onChange={(event) => setProjectId(event.target.value)}
                className="h-[42px] rounded-lg border-[#D1D5DB] p-[3px] pr-9 pl-3 text-sm font-normal leading-[125%] text-[#6B7280] shadow-none"
              >
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </Select>
            </div>
            <FieldError>{errors.projectId}</FieldError>
          </div>

          <div>
            <FieldLabel htmlFor="workType" withInfo>
              Type of Work *
            </FieldLabel>
            <div className="mt-2 w-full max-w-[364px]">
              <Select
                id="workType"
                value={workType}
                onChange={(event) => setWorkType(event.target.value)}
                className="h-[42px] rounded-lg border-[#D1D5DB] p-[3px] pr-9 pl-3 text-sm font-normal leading-[125%] text-[#6B7280] shadow-none"
              >
                {workTypes.map((type) => (
                  <option key={type.id} value={type.name}>
                    {type.name}
                  </option>
                ))}
              </Select>
            </div>
            <FieldError>{errors.workType}</FieldError>
          </div>

          <div>
            <FieldLabel htmlFor="description">Task description *</FieldLabel>
            <Textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Write text here ..."
              className="mt-2 rounded-lg"
            />
            <p className="mt-2 text-xs text-muted">A note for extra info</p>
            <FieldError>{errors.description}</FieldError>
          </div>

          <div className="flex flex-col">
            <FieldLabel>Hours *</FieldLabel>
            <div className="mt-2 inline-flex h-[37px] items-stretch self-start">
              <button
                type="button"
                className="flex h-[37px] w-[34px] items-center justify-center rounded-l-lg border border-[#D1D5DB] bg-[#F3F4F6] hover:bg-gray-200"
                onClick={() => setHours((value) => Math.max(1, value - 1))}
                aria-label="Decrease hours"
              >
                <span className="block h-0 w-[7px] border-t-2 border-[#111928]" />
              </button>
              <span className="-ml-px flex h-[37px] w-[47px] items-center justify-center border border-[#D1D5DB] bg-white text-sm font-medium text-ink">
                {hours}
              </span>
              <button
                type="button"
                className="-ml-px flex h-[37px] w-[34px] items-center justify-center rounded-r-lg border border-[#D1D5DB] bg-[#F3F4F6] hover:bg-gray-200"
                onClick={() => setHours((value) => Math.min(24, value + 1))}
                aria-label="Increase hours"
              >
                <span className="relative flex h-[10px] w-[10px] items-center justify-center">
                  <span className="absolute block h-0 w-[7px] border-t-2 border-[#111928]" />
                  <span className="absolute block h-[7px] w-0 border-l-2 border-[#111928]" />
                </span>
              </button>
            </div>
            <FieldError>{errors.hours}</FieldError>
          </div>

          {formError ? <p className="text-sm font-medium text-red-600">{formError}</p> : null}
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-line px-5 py-5">
          <Button
            type="button"
            onClick={submit}
            disabled={saving}
            className="h-[37px] rounded-lg bg-brand hover:bg-brand-hover"
          >
            {saving ? "Saving..." : isEditing ? "Save" : "Add entry"}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose} className="h-[34px] rounded-lg">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
