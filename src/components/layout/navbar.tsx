"use client";

import { ChevronDown } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export function Navbar({ userName = "John Doe" }: { userName?: string | null }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="h-12 border-b border-gray-100 bg-white">
      <div className="mx-auto flex h-full max-w-[1180px] items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="text-xl font-bold tracking-tight text-ink">
            ticktock
          </Link>
          <Link href="/dashboard" className="text-sm font-semibold text-ink">
            Timesheets
          </Link>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-ink"
            aria-expanded={open}
          >
            {userName}
            <ChevronDown className="h-4 w-4" />
          </button>
          {open ? (
            <div className="absolute right-0 z-20 mt-2 w-32 rounded-md border border-line bg-white p-1 shadow-lg">
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="w-full rounded px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
              >
                Sign out
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
