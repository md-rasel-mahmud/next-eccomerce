// lib/models/User.ts
import { Roles } from "@/enums/Roles.enum";
import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  password: string;
  role?: Roles;
  phone: string;
}

const UserSchema: Schema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    phone: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: Roles, default: Roles.USER },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
