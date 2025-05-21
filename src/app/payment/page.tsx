"use client";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Layout from "@/components/Layout";
import { CreditCard, Landmark, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Get cart items from local storage or use empty array
  const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");

  // Calculate cart total
  const cartTotal = cartItems.reduce(
    (
      sum: number,
      item: {
        product: { price: number };
        quantity: number;
      }
    ) => sum + item.quantity * item.product.price,
    0
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Save payment method to local storage
    localStorage.setItem("paymentMethod", paymentMethod);

    // Mock order processing
    setTimeout(() => {
      // Generate a random order ID
      const orderId = `ORD-${Math.floor(Math.random() * 10000)}`;

      // Create order object
      const order = {
        id: orderId,
        items: cartItems,
        shippingInfo: JSON.parse(localStorage.getItem("shippingInfo") || "{}"),
        paymentMethod,
        totalAmount: cartTotal,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      // Save order to local storage
      const orders = JSON.parse(localStorage.getItem("orders") || "[]");
      orders.push(order);
      localStorage.setItem("orders", JSON.stringify(orders));

      // Clear cart
      localStorage.setItem("cart", JSON.stringify([]));

      toast({
        title: "Order placed successfully",
        description: `Your order #${orderId} has been placed.`,
      });

      router.push(`/order-success?id=${orderId}`);
      setIsLoading(false);
    }, 1500);
  };

  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl md:text-3xl font-display font-semibold mb-4">
            Your cart is empty
          </h1>
          <p className="mb-6 text-muted-foreground">
            Add some products to your cart before proceeding to checkout.
          </p>
          <Button
            onClick={() => router.push("/products")}
            className="bg-organic-500 hover:bg-organic-600"
          >
            Continue Shopping
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8 md:py-12">
        <h1 className="text-2xl md:text-3xl font-display font-semibold text-center mb-8">
          Payment Method
        </h1>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Select Payment Method</CardTitle>
              <CardDescription>Choose how you want to pay</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="credit-card" id="credit-card" />
                    <Label
                      htmlFor="credit-card"
                      className="flex items-center flex-1 cursor-pointer"
                    >
                      <CreditCard className="h-5 w-5 mr-3 text-organic-500" />
                      <div>
                        <div className="font-medium">Credit/Debit Card</div>
                        <div className="text-sm text-muted-foreground">
                          Pay securely with your card
                        </div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="bank-transfer" id="bank-transfer" />
                    <Label
                      htmlFor="bank-transfer"
                      className="flex items-center flex-1 cursor-pointer"
                    >
                      <Landmark className="h-5 w-5 mr-3 text-organic-500" />
                      <div>
                        <div className="font-medium">Bank Transfer</div>
                        <div className="text-sm text-muted-foreground">
                          Pay directly from your bank account
                        </div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-muted/50 transition-colors">
                    <RadioGroupItem
                      value="cash-on-delivery"
                      id="cash-on-delivery"
                    />
                    <Label
                      htmlFor="cash-on-delivery"
                      className="flex items-center flex-1 cursor-pointer"
                    >
                      <ShieldCheck className="h-5 w-5 mr-3 text-organic-500" />
                      <div>
                        <div className="font-medium">Cash on Delivery</div>
                        <div className="text-sm text-muted-foreground">
                          Pay when you receive your order
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>

                <div className="mt-8 space-y-4">
                  <div className="flex justify-between border-t border-b py-3">
                    <span className="font-medium">Total Amount:</span>
                    <span className="font-semibold text-lg">
                      ${cartTotal.toFixed(2)}
                    </span>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-organic-500 hover:bg-organic-600"
                    disabled={isLoading}
                  >
                    {isLoading ? "Processing..." : "Place Order"}
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-4">
              <Button variant="ghost" onClick={() => router.push("/shipping")}>
                Back to Shipping
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentPage;
