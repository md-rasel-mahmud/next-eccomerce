import { connectDB } from "@/lib/db";
import { Media } from "@/lib/models/media.model";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const media = await Media.findById(params.id);
  return media
    ? NextResponse.json(media)
    : NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const { title } = await req.json();
  const media = await Media.findByIdAndUpdate(
    params.id,
    { title },
    { new: true }
  );
  return media
    ? NextResponse.json(media)
    : NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const deleted = await Media.findByIdAndDelete(params.id);
  return deleted
    ? NextResponse.json({ success: true })
    : NextResponse.json({ error: "Not found" }, { status: 404 });
}
