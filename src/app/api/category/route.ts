import { buildQueryOptions } from "@/helpers/query-builder";
import {
  parseMongooseDuplicateKeyError,
  validateRequest,
} from "@/helpers/validation-request";
import { connectDB } from "@/lib/db";
import { Category } from "@/lib/models/category/category.model";
import { NextRequest, NextResponse } from "next/server";
import type { SortOrder } from "mongoose";
import { categoryValidation } from "@/lib/models/category/category.dto";

// GET - get all categories
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url!);
    const query = Object.fromEntries(searchParams.entries());

    const { filter, pagination, sort } = buildQueryOptions(query);

    const categories = await Category.find(filter)
      .sort(sort as Record<string, SortOrder>)
      .skip(pagination.skip)
      .limit(pagination.limit);

    const total = await Category.countDocuments(filter);

    const response = {
      status: 200,
      message: "Categories fetched successfully",
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        sortBy: pagination.sortBy,
        sortOrder: pagination.sortOrder,
        totalPages: Math.ceil(total / pagination.limit),
        totalItems: total,
      },
      data: categories,
    };

    return NextResponse.json(response, {
      status: response.status,
      statusText: response.message,
    });
  } catch (error) {
    console.error("Category Fetch Error:", error);
    return NextResponse.json(
      {
        status: 500,
        message: "Failed to fetch categories",
      },
      { status: 500 }
    );
  }
}

// POST - create a new category
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const validatedBody = await validateRequest(request, categoryValidation);

    if (!validatedBody.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: validatedBody.errors },
        { status: 400 }
      );
    }

    const newCategory = new Category(validatedBody.data);

    const data = await newCategory.save();

    const response = {
      status: 201,
      message: "Category created successfully",
      data,
    };

    return NextResponse.json(response, {
      status: response.status,
      statusText: response.message,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error creating category:", error);

    if (error?.code === 11000) {
      const errors = parseMongooseDuplicateKeyError(error);

      return NextResponse.json(
        { message: "Duplicate key error", errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Failed to create category",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
