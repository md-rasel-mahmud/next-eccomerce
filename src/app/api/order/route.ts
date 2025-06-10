import { buildQueryOptions } from "@/helpers/query-builder";
import {
  parseMongooseDuplicateKeyError,
  validateRequest,
} from "@/helpers/validation-request";
import { connectDB } from "@/lib/db";
import { checkoutValidationBackend } from "@/lib/models/checkout/checkout.dto";
import { Order } from "@/lib/models/order/order.model";
import { NextRequest, NextResponse } from "next/server";

// GET - get all orders
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const query = Object.fromEntries(searchParams.entries());

    const { filter, pagination, sort, categorySlug } = buildQueryOptions(query);

    // Start aggregation pipeline
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pipeline: any[] = [
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
    ];

    // If categorySlug is provided, add match stage for category slug + other filters
    if (categorySlug) {
      pipeline.push({
        $match: {
          ...filter,
          "category.slug": categorySlug,
        },
      });
    } else {
      // No categorySlug filter, just apply other filters if any
      if (Object.keys(filter).length > 0) {
        pipeline.push({ $match: filter });
      }
    }

    if (Object.keys(sort).length > 1) {
      pipeline.push({ $sort: sort });
    }

    pipeline.push({ $skip: pagination.skip });

    const orders = await Order.aggregate(pipeline);

    // For total count, do a similar pipeline without skip, limit, sort
    const countPipeline = [
      ...pipeline.filter(
        (stage) =>
          !("$skip" in stage) && !("$limit" in stage) && !("$sort" in stage)
      ),
    ];

    countPipeline.push({ $count: "total" });

    const countResult = await Order.aggregate(countPipeline);
    const total = countResult.length > 0 ? countResult[0].total : 0;

    return NextResponse.json({
      status: 200,
      message: "Orders fetched successfully",
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        sortBy: pagination.sortBy,
        sortOrder: pagination.sortOrder,
        totalPages: Math.ceil(total / pagination.limit),
        totalItems: total,
      },
      data: orders,
    });
  } catch (error) {
    console.error("Order Fetch Error:", error);
    return NextResponse.json(
      {
        status: 500,
        message: "Failed to fetch orders",
      },
      { status: 500 }
    );
  }
}

// POST - create a new order
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const validatedBody = await validateRequest(
      request,
      checkoutValidationBackend
    );

    if (!validatedBody.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: validatedBody.errors },
        { status: 400 }
      );
    }

    const newOrder = new Order(validatedBody.data);

    const data = await newOrder.save();

    const response = {
      status: 201,
      message: "Order created successfully",
      data,
    };

    return NextResponse.json(response, {
      status: response.status,
      statusText: response.message,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error creating order:", error);

    if (error?.code === 11000) {
      const errors = parseMongooseDuplicateKeyError(error);

      return NextResponse.json(
        { message: "Duplicate key error", errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Failed to create order",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
