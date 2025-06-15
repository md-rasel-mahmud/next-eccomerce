import { connectDB } from "@/lib/db";
import { Order } from "@/lib/models/order/order.model";
import { NextRequest, NextResponse } from "next/server";
import { OrderStatus } from "@/enums/Status.enum";

// PATCH - update status
export async function PATCH(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json(
        { message: "Order ID and status are required." },
        { status: 400 }
      );
    }
    if (!Object.values(OrderStatus).includes(status)) {
      return NextResponse.json(
        { message: "Invalid order status." },
        { status: 400 }
      );
    }
    const updatedOrder = await Order.findOneAndUpdate(
      { orderId },
      { status },
      { new: true }
    );
    if (!updatedOrder) {
      return NextResponse.json(
        { message: "Order not found." },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Order status updated successfully.", data: updatedOrder },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      {
        message: "Failed to update order status",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
