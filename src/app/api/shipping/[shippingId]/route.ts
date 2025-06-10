import { validateRequest } from "@/helpers/validation-request";
import { connectDB } from "@/lib/db";
import { shippingValidation } from "@/lib/models/shipping/shipping.dto";
import { Shipping } from "@/lib/models/shipping/shipping.model";
import { NextRequest, NextResponse } from "next/server";

// PATCH - update a shipping
export async function PATCH(
  request: NextRequest,
  { params }: { params: { shippingId: string } }
) {
  await connectDB();

  const validatedBody = await validateRequest(request, shippingValidation);

  if (!validatedBody.success) {
    return NextResponse.json(
      { message: "Validation failed", errors: validatedBody.errors },
      { status: 400 }
    );
  }

  const data = await Shipping.findByIdAndUpdate(
    params.shippingId,
    validatedBody.data,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!data) {
    return NextResponse.json(
      { message: "Shipping not found" },
      { status: 404 }
    );
  }

  const response = {
    status: 200,
    message: "Shipping updated successfully",
    data,
  };

  return NextResponse.json(response);
}

// DELETE - delete a shipping
export async function DELETE(
  request: NextRequest,
  { params }: { params: { shippingId: string } }
) {
  await connectDB();

  const data = await Shipping.findByIdAndDelete(params.shippingId);

  if (!data) {
    return NextResponse.json(
      { message: "Shipping not found" },
      { status: 404 }
    );
  }

  const response = {
    status: 200,
    message: "Shipping deleted successfully",
    data,
  };

  return NextResponse.json(response);
}
