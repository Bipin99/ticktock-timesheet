"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { StatusBadge } from "@/components/timesheet/status-badge";
import { apiGet } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import type { TimesheetStatus, TimesheetSummary } from "@/types";

type TimesheetResponse = {
  data: TimesheetSummary[];
  meta: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
};

const dateRanges = {
  ALL: { label: "Date Range", dateFrom: "", dateTo: "" },
  JAN: { label: "January 2024", dateFrom: "2024-01-01", dateTo: "2024-01-31" },
  FEB: { label: "February 2024", dateFrom: "2024-02-01", dateTo: "2024-02-29" },
  MAR: { label: "March 2024", dateFrom: "2024-03-01", dateTo: "2024-03-31" },
};

type RangeKey = keyof typeof dateRanges;
type StatusFilter = TimesheetStatus | "ALL";

function getPageItems(totalPages: number, currentPage: number) {
  if (totalPages <= 8) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const items: Array<number | "ellipsis"> = [1, 2, 3, 4, 5, 6, 7, 8];

  if (currentPage > 8 && currentPage < totalPages) {
    return [1, 2, 3, "ellipsis" as const, currentPage, "ellipsis" as const, totalPages];
  }

  items.push("ellipsis", totalPages);
  return items;
}

export function TimesheetTable() {
  const [range, setRange] = useState<RangeKey>("ALL");
  const [status, setStatus] = useState<StatusFilter>("ALL");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [payload, setPayload] = useState<TimesheetResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const query = useMemo(() => {
    const params = new URLSearchParams({
      page: String(page),
      perPage: String(perPage),
      status,
    });
    const selectedRange = dateRanges[range];

    if (selectedRange.dateFrom && selectedRange.dateTo) {
      params.set("dateFrom", selectedRange.dateFrom);
      params.set("dateTo", selectedRange.dateTo);
    }

    return params.toString();
  }, [page, perPage, range, status]);

  useEffect(() => {
    let active = true;

    async function load() {
      const result = await apiGet<TimesheetResponse>(`/api/timesheets?${query}`);

      if (!active) {
        return;
      }

      if (!result.ok) {
        setError(result.error);
        setPayload(null);
      } else {
        setError("");
        setPayload(result.data);
        if (result.data.meta.page > result.data.meta.totalPages) {
          setPage(result.data.meta.totalPages);
        }
      }

      setLoading(false);
    }

    load();
    return () => {
      active = false;
    };
  }, [query]);

  const totalPages = payload?.meta.totalPages ?? 1;
  const pageItems = getPageItems(totalPages, page);

  return (
    <section className="rounded-md border border-line bg-white px-4 py-5 shadow-sm sm:px-6">
      <div className="mb-5">
        <h1 className="text-xl font-bold tracking-tight text-ink">Your Timesheets</h1>
      </div>

      <div className="mb-6 flex flex-wrap gap-2.5">
        <FilterSelect
          value={range}
          ariaLabel="Date Range"
          onChange={(value) => {
            setRange(value as RangeKey);
            setPage(1);
            setLoading(true);
          }}
        >
          {Object.entries(dateRanges).map(([key, value]) => (
            <option key={key} value={key}>
              {value.label}
            </option>
          ))}
        </FilterSelect>

        <FilterSelect
          value={status}
          ariaLabel="Status"
          onChange={(value) => {
            setStatus(value as StatusFilter);
            setPage(1);
            setLoading(true);
          }}
        >
          <option value="ALL">Status</option>
          <option value="COMPLETED">Completed</option>
          <option value="INCOMPLETE">Incomplete</option>
          <option value="MISSING">Missing</option>
        </FilterSelect>
      </div>

      <div className="overflow-hidden rounded-md border border-line">
        <div className="hidden bg-surface px-0 text-[11px] font-semibold uppercase tracking-wide text-muted md:grid md:grid-cols-[90px_1fr_180px_120px]">
          <span className="border-r border-line px-4 py-3">Week # ↓</span>
          <span className="px-4 py-3">Date ↓</span>
          <span className="px-4 py-3">Status ↓</span>
          <span className="px-4 py-3 text-right">Actions</span>
        </div>

        {loading ? <TableState>Loading timesheets...</TableState> : null}
        {error ? <TableState>{error}</TableState> : null}
        {!loading && !error && payload?.data.length === 0 ? <TableState>No timesheets found.</TableState> : null}

        {!loading && !error
          ? payload?.data.map((timesheet) => (
              <div
                key={timesheet.id}
                className="grid gap-3 border-t border-line px-4 py-4 text-sm text-muted md:grid-cols-[90px_1fr_180px_120px] md:items-center md:gap-0 md:px-0 md:py-0"
              >
                <div className="md:border-r md:border-line md:bg-surface md:px-4 md:py-3">
                  <MobileLabel>Week #</MobileLabel>
                  {timesheet.weekNumber}
                </div>
                <div className="md:px-4 md:py-3">
                  <MobileLabel>Date</MobileLabel>
                  {timesheet.dateRange}
                </div>
                <div className="md:px-4 md:py-3">
                  <MobileLabel>Status</MobileLabel>
                  <StatusBadge status={timesheet.status} />
                </div>
                <div className="md:px-4 md:py-3 md:text-right">
                  <MobileLabel>Actions</MobileLabel>
                  <Link
                    href={`/timesheets/${timesheet.id}`}
                    className="text-base font-normal leading-[125%] text-brand hover:underline"
                  >
                    {timesheet.action}
                  </Link>
                </div>
              </div>
            ))
          : null}
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative inline-flex">
          <select
            className="h-9 w-[118px] appearance-none rounded-lg border border-line bg-surface py-2 pr-8 pl-3 text-sm font-medium text-ink shadow-[0px_1px_0.5px_0.05px_#1D293D05]"
            value={perPage}
            onChange={(event) => {
              setPerPage(Number(event.target.value));
              setPage(1);
              setLoading(true);
            }}
            aria-label="Rows per page"
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 h-4 w-4 -translate-y-1/2 text-ink" />
        </div>

        <div className="inline-flex overflow-hidden rounded-lg border border-line bg-white">
          <PageButton
            position="first"
            disabled={page === 1}
            onClick={() => {
              setLoading(true);
              setPage((value) => Math.max(value - 1, 1));
            }}
          >
            Previous
          </PageButton>

          {pageItems.map((item, index) =>
            item === "ellipsis" ? (
              <span
                key={`ellipsis-${index}`}
                className="flex h-9 min-w-9 items-center justify-center border-l border-line px-3 text-sm font-medium text-muted"
              >
                ...
              </span>
            ) : (
              <PageButton
                key={item}
                position="middle"
                active={item === page}
                onClick={() => {
                  setLoading(true);
                  setPage(item);
                }}
              >
                {item}
              </PageButton>
            ),
          )}

          <PageButton
            position="last"
            disabled={page === totalPages}
            onClick={() => {
              setLoading(true);
              setPage((value) => Math.min(value + 1, totalPages));
            }}
          >
            Next
          </PageButton>
        </div>
      </div>
    </section>
  );
}

function FilterSelect({
  value,
  onChange,
  ariaLabel,
  children,
}: {
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <select
        className="h-[42px] w-[152px] appearance-none rounded-lg border border-[#D1D5DB] bg-white py-3 pr-9 pl-3 text-sm font-normal leading-[125%] text-muted"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={ariaLabel}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted" />
    </div>
  );
}

function TableState({ children }: { children: React.ReactNode }) {
  return <div className="border-t border-line px-4 py-10 text-center text-sm text-gray-500">{children}</div>;
}

function MobileLabel({ children }: { children: React.ReactNode }) {
  return <span className="mb-1 block text-[10px] font-semibold uppercase text-gray-400 md:hidden">{children}</span>;
}

function PageButton({
  active,
  position,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  position: "first" | "middle" | "last";
}) {
  return (
    <button
      type="button"
      className={cn(
        "flex h-9 items-center justify-center border-l border-line px-3 text-sm font-medium transition disabled:opacity-50",
        position === "first" && "border-l-0 px-3",
        position === "middle" && "min-w-9",
        active ? "bg-surface font-medium text-[#1447E6]" : "bg-white text-muted hover:bg-surface",
        className,
      )}
      {...props}
    />
  );
}
