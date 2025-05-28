import { connectDB } from "@/lib/db";
import { Category } from "@/lib/models/category/category.model";
import { NextResponse } from "next/server";

// GET - get category dropdown options
export async function GET() {
  try {
    await connectDB();

    // Fetch categories and transform them for dropdown options
    const categories = await Category.aggregate([
      {
        $project: {
          _id: 1,
          name: 1,
          slug: 1,
          image: 1,
        },
      },
      {
        $addFields: {
          value: "$_id",
          label: "$name",
        },
      },
      {
        $project: {
          _id: 0,
          value: 1,
          label: 1,
          slug: 1,
          image: 1,
        },
      },
    ]);

    const response = {
      status: 200,
      message: "Category options fetched successfully",
      data: categories,
    };

    return NextResponse.json(response, {
      status: response.status,
      statusText: response.message,
    });
  } catch (error) {
    console.error("Category Options Fetch Error:", error);
    return NextResponse.json(
      {
        status: 500,
        message: "Failed to fetch category options",
      },
      { status: 500 }
    );
  }
}
