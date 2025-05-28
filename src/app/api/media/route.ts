import { writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Media } from "@/lib/models/media.model";
import { buildQueryOptions } from "@/helpers/query-builder";
import { SortOrder } from "mongoose";

export async function POST(req: Request) {
  try {
    await connectDB();
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const type = formData.get("type") as "image" | "video";

    if (!file || !title || !type) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${file.name}`;
    const filePath = path.join(process.cwd(), "public/media", filename);
    await writeFile(filePath, buffer);

    const url = `/media/${filename}`;
    const media = await Media.create({ title, url, type });

    return NextResponse.json(media, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: "Upload failed", details: err },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url!);
    const query = Object.fromEntries(searchParams.entries());

    const { filter, pagination, sort } = buildQueryOptions(query);

    const medias = await Media.find(filter)
      .sort(sort as Record<string, SortOrder>)
      .skip(pagination.skip)
      .limit(pagination.limit);

    const total = await Media.countDocuments(filter);

    const response = {
      status: 200,
      message: "Media fetched successfully",
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        sortBy: pagination.sortBy,
        sortOrder: pagination.sortOrder,
        totalPages: Math.ceil(total / pagination.limit),
        totalItems: total,
      },
      data: medias,
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
