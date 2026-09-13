"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { FieldError, Input, Label } from "@/components/ui/form";
import { loginSchema } from "@/lib/validations";

type FormErrors = Partial<Record<keyof z.infer<typeof loginSchema>, string>>;

export function LoginForm() {
  const router = useRouter();
  const [errors, setErrors] = useState<FormErrors>({});
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setAuthError("");
    const parsed = loginSchema.safeParse({
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      remember: formData.get("remember") === "on",
    });

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      return;
    }

    setErrors({});
    setLoading(true);
    const result = await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      remember: String(Boolean(parsed.data.remember)),
      redirect: false,
    });
    setLoading(false);

    if (!result?.ok) {
      setAuthError("Invalid email or password.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form action={onSubmit} className="w-full max-w-[480px]">
      <h1 className="mb-6 text-xl font-bold leading-[125%] tracking-normal text-ink">Welcome back</h1>

      <div className="space-y-4">
        <div>
          <Label htmlFor="email" className="text-sm font-medium leading-[150%] text-ink">
            Email
          </Label>
          <Input id="email" name="email" type="email" placeholder="name@example.com" className="mt-2" />
          <FieldError>{errors.email}</FieldError>
        </div>

        <div>
          <Label htmlFor="password" className="text-sm font-medium leading-[150%] text-ink">
            Password
          </Label>
          <Input id="password" name="password" type="password" placeholder="••••••••••••" className="mt-2" />
          <FieldError>{errors.password}</FieldError>
        </div>

        <label className="flex items-center gap-2 text-sm font-medium leading-none text-muted">
          <input
            name="remember"
            type="checkbox"
            className="h-4 w-4 rounded border-line text-brand focus:ring-brand"
          />
          Remember me
        </label>

        {authError ? <p className="text-sm font-medium text-red-600">{authError}</p> : null}

        <Button
          type="submit"
          className="h-[41px] w-full rounded-lg bg-brand-strong hover:bg-brand-strong/90"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </div>
    </form>
  );
}
