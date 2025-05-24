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

type ParsedDuplicateError = {
  field: string;
  message: string;
};

export function parseMongooseDuplicateKeyError(
  error: unknown
): ParsedDuplicateError[] {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: number }).code === 11000 &&
    "keyPattern" in error &&
    "keyValue" in error
  ) {
    const keyPattern = (error as { keyPattern: Record<string, unknown> })
      .keyPattern;
    return Object.keys(keyPattern).map((field) => ({
      field,
      message: `${
        field.charAt(0).toUpperCase() + field.slice(1)
      } must be unique.`,
    }));
  }

  return [
    {
      field: "unknown",
      message: "Duplicate key error",
    },
  ];
}
