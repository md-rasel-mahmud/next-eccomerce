/* eslint-disable @typescript-eslint/ban-ts-comment */
// app/api/register/route.ts
import { Roles } from "@/enums/Roles.enum";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/user.model";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { name, password, role, phone } = await req.json();
  await connectDB();

  const existingUser = await User.findOne({ phone });

  if (existingUser) {
    return NextResponse.json(
      { message: "User already exists" },
      { status: 400 }
    );
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      phone,
      password: hashedPassword,
      role: role || Roles.USER,
    });

    const data = await newUser.save();
    // @ts-ignore
    // @ts-expect-error
    data.password = undefined;

    return NextResponse.json(
      { message: "User registered successfully", data },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error saving user", error },
      { status: 500 }
    );
  }
}
