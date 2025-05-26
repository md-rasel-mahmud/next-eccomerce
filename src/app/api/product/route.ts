import { buildQueryOptions } from "@/helpers/query-builder";
import {
  parseMongooseDuplicateKeyError,
  validateRequest,
} from "@/helpers/validation-request";
import { connectDB } from "@/lib/db";
import { Product, productValidation } from "@/lib/models/product.model";
import { NextRequest, NextResponse } from "next/server";
import type { SortOrder } from "mongoose";

// GET - get all products
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url!);
    const query = Object.fromEntries(searchParams.entries());

    const { filter, pagination, sort } = buildQueryOptions(query);

    const products = await Product.find(filter)
      .sort(sort as Record<string, SortOrder>)
      .skip(pagination.skip)
      .limit(pagination.limit);

    const total = await Product.countDocuments(filter);

    const response = {
      status: 200,
      message: "Products fetched successfully",
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        sortBy: pagination.sortBy,
        sortOrder: pagination.sortOrder,
        totalPages: Math.ceil(total / pagination.limit),
        totalItems: total,
      },
      data: products,
    };

    return NextResponse.json(response, {
      status: response.status,
      statusText: response.message,
    });
  } catch (error) {
    console.error("Product Fetch Error:", error);
    return NextResponse.json(
      {
        status: 500,
        message: "Failed to fetch products",
      },
      { status: 500 }
    );
  }
}

// POST - create a new product
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const validatedBody = await validateRequest(request, productValidation);

    if (!validatedBody.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: validatedBody.errors },
        { status: 400 }
      );
    }

    const newProduct = new Product(validatedBody.data);

    const data = await newProduct.save();

    const response = {
      status: 201,
      message: "Product created successfully",
      data,
    };

    return NextResponse.json(response, {
      status: response.status,
      statusText: response.message,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error creating product:", error);

    if (error?.code === 11000) {
      const errors = parseMongooseDuplicateKeyError(error);

      return NextResponse.json(
        { message: "Duplicate key error", errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Failed to create product",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
