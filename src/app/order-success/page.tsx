import OrderView from "@/components/OrderView";
import { CheckCircle } from "lucide-react";
import React from "react";

const page = () => {
  return (
    <>
      <div className="container mx-auto">
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
      </div>

      <OrderView />
    </>
  );
};

export default page;
