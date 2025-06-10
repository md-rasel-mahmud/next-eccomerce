import { connectDB } from "@/lib/db";
import { Shipping } from "@/lib/models/shipping/shipping.model";
import { NextResponse } from "next/server";

// GET - get shipping dropdown options
export async function GET() {
  try {
    await connectDB();

    // Fetch shippings and transform them for dropdown options
    const shippings = await Shipping.aggregate([
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
      message: "Shipping options fetched successfully",
      data: shippings,
    };

    return NextResponse.json(response, {
      status: response.status,
      statusText: response.message,
    });
  } catch (error) {
    console.error("Shipping Options Fetch Error:", error);
    return NextResponse.json(
      {
        status: 500,
        message: "Failed to fetch shipping options",
      },
      { status: 500 }
    );
  }
}
