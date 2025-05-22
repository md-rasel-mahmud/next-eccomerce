"use client";
import React from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useStore } from "@/context/StoreContext";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const CartPage = () => {
  const { state, dispatch } = useStore();
  const router = useRouter();
  const { data } = useSession();
  const user = data?.user;

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    dispatch({
      type: "UPDATE_QUANTITY",
      productId,
      quantity: newQuantity,
    });
  };

  const removeFromCart = (productId: string) => {
    dispatch({
      type: "REMOVE_FROM_CART",
      productId,
    });

    toast({
      title: "Item removed",
      description: "The item was removed from your cart",
    });
  };

  const subtotal = state.cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const shippingCost = subtotal > 0 ? 5.99 : 0;
  const total = subtotal + shippingCost;

  const handleCheckout = () => {
    if (!user) {
      router.push("/login");
      toast({
        title: "Login Required",
        description: "Please log in to continue with checkout",
      });
      return;
    }

    router.push("/shipping");
  };

  return (
    <>
      <div className="container py-8 md:py-12">
        <h1 className="text-2xl md:text-3xl font-display font-semibold mb-8">
          Your Shopping Cart
        </h1>

        {state.cart.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Looks like you haven&apos;t added any products to your cart yet.
            </p>
            <Button
              onClick={() => router.push("/products")}
              className="bg-organic-500 hover:bg-organic-600"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              {state.cart.map((item) => (
                <div
                  key={item.productId}
                  className="flex flex-col md:flex-row items-start md:items-center gap-4 border-b py-6"
                >
                  <div className="w-24 h-24 bg-muted rounded-md overflow-hidden">
                    <Image
                      src={item.product.images[0] || "/placeholder.svg"}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                      width={96}
                      height={96}
                    />
                  </div>
                  <div className="flex-1">
                    <Link
                      href={`/product/${item.product.slug}`}
                      className="font-medium hover:text-organic-500 transition-colors"
                    >
                      {item.product.name}
                    </Link>
                    <div className="text-organic-500 font-medium mt-1">
                      ${item.product.price.toFixed(2)}
                    </div>
                    {item.product.inStock ? (
                      <div className="text-green-600 text-sm mt-1">
                        In Stock
                      </div>
                    ) : (
                      <div className="text-red-500 text-sm mt-1">
                        Out of Stock
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 mt-2 md:mt-0">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                      disabled={!item.product.inStock}
                    >
                      +
                    </Button>
                  </div>
                  <div className="font-medium text-right min-w-20 mt-2 md:mt-0">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromCart(item.productId)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>${shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between font-medium">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-organic-500 hover:bg-organic-600"
                  >
                    {user ? "Proceed to Checkout" : "Login to Checkout"}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartPage;
