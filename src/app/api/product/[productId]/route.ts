import { validateRequest } from "@/helpers/validation-request";
import { connectDB } from "@/lib/db";
import { productValidation } from "@/lib/models/product/product.dto";
import { Product } from "@/lib/models/product/product.model";
import { NextRequest, NextResponse } from "next/server";

// PATCH - update a product
export async function PATCH(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  await connectDB();

  const validatedBody = await validateRequest(request, productValidation);

  if (!validatedBody.success) {
    return NextResponse.json(
      { message: "Validation failed", errors: validatedBody.errors },
      { status: 400 }
    );
  }

  const data = await Product.findByIdAndUpdate(
    params.productId,
    validatedBody.data,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!data) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }

  const response = {
    status: 200,
    message: "Product updated successfully",
    data,
  };

  return NextResponse.json(response);
}

// DELETE - delete a product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  await connectDB();

  const data = await Product.findByIdAndDelete(params.productId);

  if (!data) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }

  const response = {
    status: 200,
    message: "Product deleted successfully",
    data,
  };

  return NextResponse.json(response);
}
