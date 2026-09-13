import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { requireSession, validationError } from "@/lib/api-response";
import { deleteEntry, getTimesheetDetail, updateEntry } from "@/lib/timesheet-store";
import { entrySchema } from "@/lib/validations";

type RouteContext = {
  params: Promise<{
    id: string;
    entryId: string;
  }>;
};

export async function PUT(request: Request, context: RouteContext) {
  const { response } = await requireSession();

  if (response) {
    return response;
  }

  const { id, entryId } = await context.params;

  try {
    const body = await request.json();
    const input = entrySchema.parse(body);
    const entry = updateEntry(id, entryId, input);

    if (!entry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    return NextResponse.json({ data: entry, timesheet: getTimesheetDetail(id) });
  } catch (error) {
    if (error instanceof ZodError) {
      return validationError(error.flatten().fieldErrors);
    }

    return NextResponse.json({ error: "Unable to update entry" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { response } = await requireSession();

  if (response) {
    return response;
  }

  const { id, entryId } = await context.params;
  const deleted = deleteEntry(id, entryId);

  if (!deleted) {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  }

  return NextResponse.json({ data: true, timesheet: getTimesheetDetail(id) });
}
