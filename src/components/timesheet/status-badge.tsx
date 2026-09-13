import { cn } from "@/lib/utils";
import type { TimesheetStatus } from "@/types";

const styles: Record<TimesheetStatus, string> = {
  COMPLETED: "bg-status-completed-bg text-status-completed-fg",
  INCOMPLETE: "bg-status-incomplete-bg text-status-incomplete-fg",
  MISSING: "bg-status-missing-bg text-status-missing-fg",
};

export function StatusBadge({ status }: { status: TimesheetStatus }) {
  return (
    <span
      className={cn(
        "inline-flex h-[22px] items-center rounded-md px-2.5 py-0.5 text-[10px] font-semibold leading-none",
        styles[status],
      )}
    >
      {status}
    </span>
  );
}
