"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "processing":
      return "bg-blue-100 text-blue-800";
    case "shipped":
      return "bg-purple-100 text-purple-800";
    case "delivered":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const OrdersPage = () => {
  const [orders, setOrders] = useState<
    {
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
    }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user) {
      router.push("/login");
      return;
    }

    // Load orders from local storage
    const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(storedOrders);
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="container py-16 text-center">
        <p>Loading your orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container py-16 text-center">
        <Package className="h-16 w-16 mx-auto text-organic-300 mb-4" />
        <h1 className="text-2xl md:text-3xl font-display font-semibold mb-4">
          No Orders Yet
        </h1>
        <p className="mb-6 text-muted-foreground">
          You haven&apos;t placed any orders yet.
        </p>
        <Button
          onClick={() => router.push("/products")}
          className="bg-organic-500 hover:bg-organic-600"
        >
          Start Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-2xl md:text-3xl font-display font-semibold mb-8">
        Your Orders
      </h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.id} className="overflow-hidden">
            <CardHeader className="bg-muted/30">
              <CardTitle className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <span>Order #{order.id}</span>
                  <span className="text-sm font-normal md:ml-4">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <span
                  className={`mt-2 md:mt-0 text-sm font-medium px-3 py-1 rounded-full ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between">
                <div className="mb-4 md:mb-0">
                  <h3 className="font-semibold mb-2">Items</h3>
                  <ul className="space-y-1 text-sm">
                    {order.items.map(
                      (
                        item: {
                          product: { name: string; price: number };
                          quantity: number;
                        },
                        index: number
                      ) => (
                        <li key={index}>
                          {item.quantity} x {item.product.name} - $
                          {(item.product.price * item.quantity).toFixed(2)}
                        </li>
                      )
                    )}
                  </ul>
                  <div className="mt-3 font-medium">
                    Total: ${order.totalAmount.toFixed(2)}
                  </div>
                </div>

                <div className="md:text-right">
                  <h3 className="font-semibold mb-2">Shipping Address</h3>
                  <div className="text-sm">
                    <p>{order.shippingInfo.fullName}</p>
                    <p>
                      {order.shippingInfo.city}, {order.shippingInfo.state}
                    </p>
                    <p>{order.shippingInfo.country}</p>
                  </div>

                  <div className="mt-4">
                    <Link href={`/order-success?id=${order.id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
