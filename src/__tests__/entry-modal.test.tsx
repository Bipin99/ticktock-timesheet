import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { EntryModal } from "@/components/timesheet/entry-modal";

describe("EntryModal", () => {
  it("shows validation errors for required fields", async () => {
    render(
      <EntryModal
        open
        timesheetId="week-1"
        date="2024-01-21"
        projects={[{ id: "project-homepage", name: "Project Name" }]}
        workTypes={[{ id: "bug-fixes", name: "Bug fixes" }]}
        onClose={vi.fn()}
        onSaved={vi.fn()}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Add entry" }));

    expect(await screen.findByText("Task description is required")).toBeInTheDocument();
    expect(screen.queryByText("Select a project")).not.toBeInTheDocument();
  });

  it("preselects Project Name and Bug fixes", () => {
    render(
      <EntryModal
        open
        timesheetId="week-1"
        date="2024-01-21"
        projects={[
          { id: "project-homepage", name: "Project Name" },
          { id: "project-mobile", name: "Mobile Redesign" },
        ]}
        workTypes={[
          { id: "bug-fixes", name: "Bug fixes" },
          { id: "feature-work", name: "Feature work" },
        ]}
        onClose={vi.fn()}
        onSaved={vi.fn()}
      />,
    );

    expect(screen.getByLabelText(/Select Project/i)).toHaveValue("project-homepage");
    expect(screen.getByLabelText(/Type of Work/i)).toHaveValue("Bug fixes");
  });
});
