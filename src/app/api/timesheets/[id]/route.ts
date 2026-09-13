import { NextResponse } from "next/server";

import { requireSession } from "@/lib/api-response";
import { getTimesheetDetail, listOptions } from "@/lib/timesheet-store";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { response } = await requireSession();

  if (response) {
    return response;
  }

  const { id } = await context.params;
  const timesheet = getTimesheetDetail(id);

  if (!timesheet) {
    return NextResponse.json({ error: "Timesheet not found" }, { status: 404 });
  }

  return NextResponse.json({ data: timesheet, options: listOptions() });
}
