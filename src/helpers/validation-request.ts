// lib/validation/validateRequest.ts
import { ZodSchema } from "zod";
import { NextRequest } from "next/server";

export async function validateRequest<T>(
  req: NextRequest,
  schema: ZodSchema<T>
): Promise<
  | { success: true; data: T }
  | { success: false; errors: { field: string; message: string }[] }
> {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      return { success: false, errors };
    }

    return { success: true, data: parsed.data };
  } catch (err: unknown) {
    console.log("err", err);
    return {
      success: false,
      errors: [{ field: "request", message: "Invalid JSON format" }],
    };
  }
}
