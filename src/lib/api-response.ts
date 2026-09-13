import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";

export async function requireSession() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return {
      session: null,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  return { session, response: null };
}

export function validationError(error: unknown) {
  return NextResponse.json({ error: "Invalid request", details: error }, { status: 400 });
}
