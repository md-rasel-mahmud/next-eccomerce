import { connectDB } from "@/lib/db";
import { Setting } from "@/lib/models/setting.model";

// @GET - Fetch settings
export async function GET() {
  await connectDB();
  // Placeholder for the GET request logic
  const data = await Setting.find();

  const response = {
    data,
    message: "Settings fetched successfully",
  };

  // This is a placeholder for the GET request handler
  return new Response(JSON.stringify(response));
}

// @POST - Create or update settings
export async function POST(req: Request) {
  await connectDB();
  const { banner, footer, socials } = await req.json();

  try {
    const existingSetting = await Setting.findOne();

    if (existingSetting) {
      // Update existing settings
      existingSetting.banner = banner;
      existingSetting.footer = footer;
      existingSetting.socials = socials;

      const updatedSetting = await existingSetting.save();

      return new Response(JSON.stringify(updatedSetting), { status: 200 });
    } else {
      // Create new settings
      const newSetting = new Setting({
        banner,
        footer,
        socials,
      });

      const savedSetting = await newSetting.save();

      const response = {
        data: savedSetting,
        message: "Settings created successfully",
      };

      return new Response(JSON.stringify(response), { status: 201 });
    }
  } catch (error: unknown) {
    console.error("Error saving settings:", error);

    return new Response(
      JSON.stringify({ message: "Error saving settings", error }),
      {
        status: 500,
      }
    );
  }
}
