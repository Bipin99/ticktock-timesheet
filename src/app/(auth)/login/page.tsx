import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/login-form";
import { authOptions } from "@/lib/auth";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-2">
      <section className="flex min-h-[60vh] items-center justify-center px-8 py-12 lg:min-h-screen lg:justify-start lg:px-24">
        <LoginForm />
      </section>

      <section className="relative flex min-h-[42vh] items-center bg-brand px-8 py-16 text-white lg:min-h-screen lg:px-24">
        <div className="max-w-[520px]">
          <p className="mb-6 text-5xl font-bold tracking-tight">ticktock</p>
          <p className="text-base font-normal leading-[150%] text-panel-text">
            Introducing ticktock, our cutting-edge timesheet web application designed to revolutionize how you manage
            employee work hours. With ticktock, you can effortlessly track and monitor employee attendance and
            productivity from anywhere, anytime, using any internet-connected device.
          </p>
        </div>
        <p className="absolute bottom-6 right-8 text-xs text-white/45">© 2024 tentwenty</p>
      </section>
    </main>
  );
}
