import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { Navbar } from "@/components/layout/navbar";
import { authOptions } from "@/lib/auth";

export default async function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-app">
      <Navbar userName={session.user.name} />
      <main className="mx-auto max-w-[980px] px-4 py-8 sm:px-8">{children}</main>
    </div>
  );
}
