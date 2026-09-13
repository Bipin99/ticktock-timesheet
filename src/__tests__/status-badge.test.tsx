import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StatusBadge } from "@/components/timesheet/status-badge";

describe("StatusBadge", () => {
  it("renders the supplied timesheet status", () => {
    render(<StatusBadge status="INCOMPLETE" />);

    expect(screen.getByText("INCOMPLETE")).toBeInTheDocument();
  });
});
