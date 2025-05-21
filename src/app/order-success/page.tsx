"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const OrderSuccessPage = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const [order, setOrder] = useState<{
    id: string;
    items: Array<{
      product: { name: string; price: number };
      quantity: number;
    }>;
    shippingInfo: {
      fullName: string;
      addressLine1: string;
      addressLine2?: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
      phoneNumber: string;
    };
    paymentMethod: string;
    totalAmount: number;
    status: string;
    createdAt: string;
  }>({
    id: "",
    items: [],
    shippingInfo: {
      fullName: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      phoneNumber: "",
    },
    paymentMethod: "",
    totalAmount: 0,
    status: "",
    createdAt: "",
  });
  const router = useRouter();

  useEffect(() => {
    if (orderId) {
      // Find the order in local storage
      const orders = JSON.parse(localStorage.getItem("orders") || "[]");
      const matchedOrder = orders.find((o: { id: string }) => o.id === orderId);
      if (matchedOrder) {
        setOrder(matchedOrder);
      }
    }
  }, [orderId]);

  if (!order) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl md:text-3xl font-display font-semibold mb-4">
          Order not found
        </h1>
        <p className="mb-6 text-muted-foreground">
          We couldn&apos;t find the order you&apos;re looking for.
        </p>
        <Button
          onClick={() => router.push("/")}
          className="bg-organic-500 hover:bg-organic-600"
        >
          Return to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-16">
      <div className="max-w-3xl mx-auto text-center mb-8">
        <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
        <h1 className="text-2xl md:text-3xl font-display font-semibold">
          Order Placed Successfully!
        </h1>
        <p className="mt-2 text-muted-foreground">
          Thank you for your order. We&apos;ve received your request and are
          processing it now.
        </p>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Order #{order.id}</span>
            <span className="text-sm font-normal px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full">
              {order.status}
            </span>
          </CardTitle>
          <CardDescription>
            Placed on {new Date(order.createdAt).toLocaleDateString()} at{" "}
            {new Date(order.createdAt).toLocaleTimeString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Order Summary</h3>
            <div className="space-y-2">
              {order.items.map(
                (
                  item: {
                    product: { name: string; price: number };
                    quantity: number;
                  },
                  index: number
                ) => (
                  <div
                    key={index}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <div className="flex items-center">
                      <div className="ml-3">
                        <div>{item.product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Qty: {item.quantity}
                        </div>
                      </div>
                    </div>
                    <div>
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                )
              )}
            </div>
            <div className="flex justify-between items-center font-medium mt-4">
              <span>Total Amount</span>
              <span>${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Shipping Address</h3>
              <div className="text-sm">
                <p>{order.shippingInfo.fullName}</p>
                <p>{order.shippingInfo.addressLine1}</p>
                {order.shippingInfo.addressLine2 && (
                  <p>{order.shippingInfo.addressLine2}</p>
                )}
                <p>
                  {order.shippingInfo.city}, {order.shippingInfo.state}{" "}
                  {order.shippingInfo.postalCode}
                </p>
                <p>{order.shippingInfo.country}</p>
                <p>Phone: {order.shippingInfo.phoneNumber}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Payment Information</h3>
              <div className="text-sm">
                <p>
                  <span className="font-medium">Payment Method:</span>{" "}
                  {order.paymentMethod === "credit-card"
                    ? "Credit/Debit Card"
                    : order.paymentMethod === "bank-transfer"
                    ? "Bank Transfer"
                    : "Cash on Delivery"}
                </p>
                <p className="mt-1">
                  <span className="font-medium">Payment Status:</span>{" "}
                  <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs">
                    Pending
                  </span>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col md:flex-row gap-4 justify-between">
          <Button variant="outline" onClick={() => router.push("/orders")}>
            View All Orders
          </Button>
          <Button
            onClick={() => router.push("/")}
            className="bg-organic-500 hover:bg-organic-600"
          >
            Continue Shopping
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OrderSuccessPage;
