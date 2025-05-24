// src/lib/db.ts
import mongoose from "mongoose";

export const connectDB = async () => {
  if (mongoose.connections[0].readyState >= 1) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI!, {
      dbName: "E_COMMERCE",
    });

    console.log("✅ DB Connected");
  } catch (error) {
    console.error("❌ DB Error:", error);
    throw error;
  }
};
