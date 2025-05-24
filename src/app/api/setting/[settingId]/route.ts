import { connectDB } from "@/lib/db";
import { Setting } from "@/lib/models/setting.model";
import { Types } from "mongoose";
import { NextRequest } from "next/server";

// @PATCH - Update settings
export async function PATCH(
  req: NextRequest,
  { params }: { params: { settingId: Types.ObjectId } }
) {
  await connectDB();
  const { banner, footer, socials } = await req.json();

  const settingId = params.settingId;

  if (!settingId) {
    return new Response(JSON.stringify({ message: "Setting ID is required" }), {
      status: 400,
    });
  }

  try {
    const updatedSetting = await Setting.findByIdAndUpdate(
      settingId,
      { banner, footer, socials },
      { new: true }
    );

    if (!updatedSetting) {
      return new Response(JSON.stringify({ message: "Settings not found" }), {
        status: 404,
      });
    }

    const response = {
      data: updatedSetting,
      message: "Settings updated successfully",
    };

    return new Response(JSON.stringify(response), {
      status: 200,
    });
  } catch (error: unknown) {
    console.error("Error updating settings:", error);

    return new Response(
      JSON.stringify({ message: "Error updating settings", error }),
      {
        status: 500,
      }
    );
  }
}
