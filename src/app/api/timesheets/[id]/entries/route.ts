import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { requireSession, validationError } from "@/lib/api-response";
import { createEntry, getTimesheetDetail } from "@/lib/timesheet-store";
import { entrySchema } from "@/lib/validations";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { response } = await requireSession();

  if (response) {
    return response;
  }

  const { id } = await context.params;

  if (!getTimesheetDetail(id)) {
    return NextResponse.json({ error: "Timesheet not found" }, { status: 404 });
  }

  try {
    const body = await request.json();
    const input = entrySchema.parse(body);
    const entry = createEntry({ ...input, timesheetId: id });

    return NextResponse.json({ data: entry, timesheet: getTimesheetDetail(id) }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return validationError(error.flatten().fieldErrors);
    }

    return NextResponse.json({ error: "Unable to create entry" }, { status: 500 });
  }
}
