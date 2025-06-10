import { buildQueryOptions } from "@/helpers/query-builder";
import {
  parseMongooseDuplicateKeyError,
  validateRequest,
} from "@/helpers/validation-request";
import { connectDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

import { Shipping } from "@/lib/models/shipping/shipping.model";
import { shippingValidation } from "@/lib/models/shipping/shipping.dto";

// GET - get all shippings
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url!);
    const query = Object.fromEntries(searchParams.entries());

    const { filter } = buildQueryOptions(query);

    const shippings = await Shipping.find(filter);

    const response = {
      status: 200,
      message: "Shippings fetched successfully",
      data: shippings,
    };

    return NextResponse.json(response, {
      status: response.status,
      statusText: response.message,
    });
  } catch (error) {
    console.error("Shipping Fetch Error:", error);
    return NextResponse.json(
      {
        status: 500,
        message: "Failed to fetch shippings",
      },
      { status: 500 }
    );
  }
}

// POST - create a new shipping
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const validatedBody = await validateRequest(request, shippingValidation);

    if (!validatedBody.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: validatedBody.errors },
        { status: 400 }
      );
    }

    const newShipping = new Shipping(validatedBody.data);

    const data = await newShipping.save();

    const response = {
      status: 201,
      message: "Shipping created successfully",
      data,
    };

    return NextResponse.json(response, {
      status: response.status,
      statusText: response.message,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error creating shipping:", error);

    if (error?.code === 11000) {
      const errors = parseMongooseDuplicateKeyError(error);

      return NextResponse.json(
        { message: "Duplicate key error", errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Failed to create shipping",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
