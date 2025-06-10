"use client";

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
import axiosRequest from "@/lib/axios";
import useSWR from "swr";
import { Product } from "@/types/types";
import { getCurrencySymbol } from "@/lib/utils";

const OrderSuccessPage = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  const { data: orderData, isLoading: orderLoading } = useSWR(
    `/order/${orderId}`,
    (url) => axiosRequest.get(url).then((res) => res.data),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const order = orderData?.data || null;

  const router = useRouter();

  if (orderLoading) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl md:text-3xl font-display font-semibold mb-4">
          Loading...
        </h1>
        <p className="mb-6 text-muted-foreground">
          Please wait while we fetch your order details.
        </p>
      </div>
    );
  }

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
            <span>Order #{order.orderId}</span>
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
                    productId: Product;
                    quantity: number;
                  },
                  index: number
                ) => {
                  const product = item.productId as Product;

                  return (
                    <div
                      key={index}
                      className="flex justify-between items-center border-b pb-2"
                    >
                      <div className="flex items-center">
                        <div className="ml-3">
                          <div>{product?.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Qty: {item.quantity}
                          </div>
                        </div>
                      </div>

                      <p>
                        {!!product?.discount && product.discount > 0 && (
                          <span className="text-xs text-gray-500 line-through pr-2">
                            {getCurrencySymbol("BDT") +
                              " " +
                              (product?.price * item?.quantity).toFixed(2)}
                          </span>
                        )}
                        {getCurrencySymbol("BDT") +
                          " " +
                          (product?.price * item?.quantity).toFixed(2)}
                      </p>
                    </div>
                  );
                }
              )}
            </div>
            <div className="flex justify-between items-center font-medium mt-4">
              <span>Total Amount</span>
              <span>
                {getCurrencySymbol("BDT") + " " + order.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Shipping Address</h3>
              <div className="text-sm space-y-2">
                <p>{order.fullName}</p>

                <div className="space-y-1 my-2">
                  <p>
                    <span className="font-semibold">Address: </span>{" "}
                    {order.address} - {order.postalCode},
                  </p>
                  <p>{order.district}, </p>
                  <p>{order.division}</p>
                </div>

                <p>
                  <span className="font-semibold">Phone:</span> {order.phone}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Payment Information</h3>
              <div className="text-sm">
                <p>
                  <span className="font-medium">Payment Method:</span>{" "}
                  <span className="text-organic-500 font-semibold">
                    {" "}
                    {order.paymentMethod === "credit-card"
                      ? "Credit/Debit Card"
                      : order.paymentMethod === "bank-transfer"
                      ? "Bank Transfer"
                      : "Cash on Delivery"}
                  </span>
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
