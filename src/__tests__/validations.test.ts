import { describe, expect, it } from "vitest";

import { entrySchema, loginSchema } from "@/lib/validations";

describe("validation schemas", () => {
  it("rejects invalid login input", () => {
    const result = loginSchema.safeParse({ email: "bad-email", password: "" });

    expect(result.success).toBe(false);
  });

  it("requires a valid entry payload", () => {
    const result = entrySchema.safeParse({
      date: "2024-01-21",
      projectId: "",
      workType: "Bug fixes",
      description: "",
      hours: 25,
    });

    expect(result.success).toBe(false);
  });
});
