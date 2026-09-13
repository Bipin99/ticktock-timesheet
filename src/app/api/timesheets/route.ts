import { NextResponse } from "next/server";

import { requireSession } from "@/lib/api-response";
import { listTimesheets } from "@/lib/timesheet-store";
import type { TimesheetStatus } from "@/types";

export async function GET(request: Request) {
  const { response } = await requireSession();

  if (response) {
    return response;
  }

  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") ?? "1");
  const perPage = Number(url.searchParams.get("perPage") ?? "5");
  const status = (url.searchParams.get("status") ?? "ALL") as TimesheetStatus | "ALL";
  const dateFrom = url.searchParams.get("dateFrom");
  const dateTo = url.searchParams.get("dateTo");

  return NextResponse.json(
    listTimesheets({
      page,
      perPage,
      status,
      dateFrom,
      dateTo,
    }),
  );
}
