import { validateRequest } from "@/helpers/validation-request";
import { connectDB } from "@/lib/db";
import { checkoutValidationBackend } from "@/lib/models/checkout/checkout.dto";
import { Order } from "@/lib/models/order/order.model";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Product } from "@/lib/models/product/product.model";

import { NextRequest, NextResponse } from "next/server";

// PATCH - update a order
export async function PATCH(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  await connectDB();

  const validatedBody = await validateRequest(
    request,
    checkoutValidationBackend
  );

  if (!validatedBody.success) {
    return NextResponse.json(
      { message: "Validation failed", errors: validatedBody.errors },
      { status: 400 }
    );
  }

  const data = await Order.findByIdAndUpdate(
    params.orderId,
    validatedBody.data,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!data) {
    return NextResponse.json({ message: "Order not found" }, { status: 404 });
  }

  const response = {
    status: 200,
    message: "Order updated successfully",
    data,
  };

  return NextResponse.json(response);
}

// GET - get a order by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  await connectDB();

  const data = await Order.findById(params.orderId).populate(
    "items.productId",
    "name slug images price discount"
  );

  if (!data) {
    return NextResponse.json({ message: "Order not found" }, { status: 404 });
  }

  const response = {
    status: 200,
    message: "Order retrieved successfully",
    data,
  };

  return NextResponse.json(response);
}

// // DELETE - delete a order
// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: { orderId: string } }
// ) {
//   await connectDB();

//   const data = await Order.findByIdAndDelete(params.orderId);

//   if (!data) {
//     return NextResponse.json({ message: "Order not found" }, { status: 404 });
//   }

//   const response = {
//     status: 200,
//     message: "Order deleted successfully",
//     data,
//   };

//   return NextResponse.json(response);
// }
