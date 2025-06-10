import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axiosRequest from "@/lib/axios";
import React from "react";
import moment from "moment-timezone"; // Ensure you have moment.js installed

interface OrderItem {
  productId: {
    _id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    discount: number;
    images: string[];
    category: string;
    tags: string[];
    badge: string;
    stockQuantity: number;
    averageRating: number;
    totalReviews: number;
    isFeatured: boolean;
    isSeasonal: boolean;
    createdAt: string;
    updatedAt: string;
  };
  quantity: number;
  price: number;
  discount: number;
  _id: string;
}

interface Order {
  _id: string;
  fullName: string;
  orderId: string;
  phone: string;
  division: string;
  district: string;
  postalCode: string;
  address: string;
  status: string;
  paymentMethod: string;
  totalAmount: number;
  shippingCharge: number;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

const UserOrders = async () => {
  try {
    const res = await axiosRequest.get("/order");

    const orders: Order[] = res.data.data;

    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Orders</CardTitle>
          <CardDescription>Your recent purchases</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {orders.length > 0 ? (
              orders.map((order: Order) => (
                <div
                  key={order._id}
                  className="bg-muted p-3 rounded-md flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">Order #{order.orderId}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()} at{" "}
                      {new Date(order.createdAt).toLocaleTimeString()} <br />
                      {moment(order.createdAt).tz("Asia/Dhaka").fromNow()}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      order.status === "DELIVERED"
                        ? "bg-green-100 text-green-700"
                        : order.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No orders found.</p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>
            Unable to fetch your orders at this time.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Please try again later.</p>
        </CardContent>
      </Card>
    );
  }
};

export default UserOrders;
