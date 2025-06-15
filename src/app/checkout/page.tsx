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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormInput, FormInputConfig } from "@/components/common/form/FormInput";
import { FieldValues, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import useSWR, { mutate } from "swr";
import axiosRequest from "@/lib/axios";
import { convertDataToObjectByKey, getCurrencySymbol } from "@/lib/utils";
import { useSession } from "next-auth/react";
import {
  CHECKOUT_DEFAULT_VALUES,
  checkoutValidation,
} from "@/lib/models/checkout/checkout.dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFetchMutation } from "@/hooks/use-fetch-mutation";
import { PaymentMethods } from "@/enums/PaymentMethods.enum";
import { clearCart } from "@/lib/store/slices/cart.slice";

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState(PaymentMethods.COD);

  const router = useRouter();
  const { data: session } = useSession();
  const dispatch = useDispatch();

  // Get cart items from local storage or use empty array

  const state = useSelector((state: RootState) => state.cart);

  const cartItems = state.cart || [];

  const { isLoading, mutateFn } = useFetchMutation();

  const { data: shippingList, isLoading: shippingListLoading } = useSWR(
    `/shipping`,
    (url) => axiosRequest.get(url).then((res) => res.data),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const shippingOptions = shippingList?.data?.map(
    (shipping: { _id: string; name: string; charge: number }) => ({
      value: shipping._id,
      label: `${shipping.name} - ${getCurrencySymbol(
        "BDT"
      )}${shipping.charge.toFixed(2)}`,
    })
  );
  const shippingObjectByIdKey = convertDataToObjectByKey(
    shippingList?.data || [],
    "_id"
  );

  // Calculate cart total
  const cartTotal = cartItems.reduce(
    (
      sum: number,
      item: {
        product: { price: number; discount?: number };
        quantity: number;
      }
    ) =>
      sum + item.quantity * item.product.price - (item.product.discount || 0),
    0
  );

  const { handleSubmit, control, watch, reset } = useForm({
    defaultValues: CHECKOUT_DEFAULT_VALUES,
    resolver: zodResolver(checkoutValidation),
    mode: "all",
  });

  useEffect(() => {
    if (session?.user) {
      reset({
        ...CHECKOUT_DEFAULT_VALUES,
        fullName: session.user.name || "",
        phone: session.user.phone || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const formSubmit = (data: FieldValues) => {
    const orderId = `ORD-${Math.floor(Math.random() * 10000)}`;

    const postBody = {
      ...data,
      orderId,
      paymentMethod: paymentMethod,
      items: cartItems.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
        discount: item.product.discount || 0,
      })),
      shippingCharge: (
        shippingObjectByIdKey[data.shipping] as { charge?: number }
      )?.charge,
      totalAmount:
        cartTotal +
        ((shippingObjectByIdKey[data.shipping] as { charge?: number })
          ?.charge || 0),
    };

    mutateFn(() =>
      axiosRequest.post("/order", postBody).then((res) => {
        mutate(
          "/order",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (prevData: any) => {
            if (!prevData) return res.data;
            return {
              ...prevData,
              data: [res.data, ...prevData.data],
            };
          },
          false
        );

        // Clear cart after successful order placement
        dispatch(clearCart());

        // Reset form
        reset(CHECKOUT_DEFAULT_VALUES);

        // Redirect to order success page
        router.push(`/order-success?id=${res?.data?.data?._id}`);

        return res.data;
      })
    );
  };

  const formData: FormInputConfig[] = [
    {
      label: "Full Name",
      name: "fullName",
      type: "text",
      placeholder: "Enter your full name",
      required: true,
      disabled: true,
    },
    {
      label: "Phone Number",
      name: "phone",
      type: "text",
      placeholder: "Enter your phone number",
      required: true,
      disabled: true,
    },
    {
      label: "Shipping",
      name: "shipping",
      type: "select",
      options: shippingOptions || [],
      disabled: shippingListLoading,
      placeholder: "Select a shipping option",
      required: true,
    },
    {
      label: "Division",
      name: "division",
      type: "text",
      placeholder: "Division or Region",
      required: true,
    },
    {
      label: "District",
      name: "district",
      type: "text",
      placeholder: "City or District",
      required: true,
    },
    {
      label: "Postal Code",
      name: "postalCode",
      type: "text",
      placeholder: "Postal or ZIP code",
      required: true,
    },
    {
      label: "Address Details",
      name: "address",
      type: "textarea",
      placeholder: "Enter your address details",
      required: true,
      className: "md:col-span-2",
    },
  ];

  if (cartItems.length === 0) {
    return (
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
    );
  }

  return (
    <div className="md:container py-8">
      <h1 className="text-2xl md:text-3xl font-display font-semibold text-center mb-8">
        Checkout
      </h1>

      {shippingListLoading ? (
        <div className="container py-16 text-center">
          <h1 className="text-2xl md:text-3xl font-display font-semibold mb-4">
            Loading shipping options...
          </h1>
        </div>
      ) : (
        <div className="max-w-screen-xl mx-auto px-4 md:px-1">
          <form
            onSubmit={handleSubmit(formSubmit)}
            className="flex flex-col md:flex-row gap-8"
          >
            <Card className="w-full md:w-2/3">
              <CardHeader>
                <CardTitle>Delivery Address</CardTitle>
                <CardDescription>
                  Please enter your shipping details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    formData={formData}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    control={control as any}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="w-full md:w-1/3">
              <CardHeader>
                <CardTitle>Select Payment Method</CardTitle>
                <CardDescription>Choose how you want to pay</CardDescription>
              </CardHeader>

              <CardContent>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(value) =>
                    setPaymentMethod(value as PaymentMethods)
                  }
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-muted/50 transition-colors">
                    <RadioGroupItem
                      value={PaymentMethods.COD}
                      id={PaymentMethods.COD}
                    />

                    <Label
                      htmlFor={PaymentMethods.COD}
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
                  <div className="space-y-3 border-t border-b py-3">
                    <div className="flex justify-between gap-2 items-center">
                      <span>Shipping Charge:</span>
                      <span>
                        {getCurrencySymbol("BDT")}{" "}
                        {(
                          (
                            shippingObjectByIdKey?.[watch("shipping")] as
                              | { charge?: number }
                              | undefined
                          )?.charge ?? 0
                        ).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between gap-2 items-center">
                      <span className="font-medium">Total Amount:</span>
                      <span className="font-semibold text-lg">
                        {getCurrencySymbol("BDT")}{" "}
                        {(
                          cartTotal +
                          ((
                            shippingObjectByIdKey?.[watch("shipping")] as
                              | { charge?: number }
                              | undefined
                          )?.charge ?? 0)
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col justify-center gap-5 pt-5">
                <Button
                  type="submit"
                  className="w-full bg-organic-500 hover:bg-organic-600"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Place Order"}
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push("/cart")}
                >
                  Back to Cart
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
