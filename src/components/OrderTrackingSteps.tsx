"use client";

import {
  Loader,
  LoaderCircle,
  Package,
  PackageCheck,
  PackageX,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import { OrderStatus } from "@/enums/Status.enum";

interface Step {
  label: string;
  value: OrderStatus;
  icon?: React.ReactNode;
}

const steps: Step[] = [
  { label: "Pending", value: OrderStatus.PENDING, icon: <LoaderCircle /> },
  { label: "Processing", value: OrderStatus.PROCESSING, icon: <Loader /> },
  { label: "Shipped", value: OrderStatus.SHIPPED, icon: <Package /> },
  { label: "Delivered", value: OrderStatus.DELIVERED, icon: <PackageCheck /> },
];

interface OrderStepsProps {
  status: OrderStatus;
}

export function OrderTrackingSteps({ status }: OrderStepsProps) {
  const cancelledOrReturned =
    status === OrderStatus.CANCELLED || status === OrderStatus.RETURNED;

  const currentStepIndex = useMemo(() => {
    return steps.findIndex((step) => step.value === status);
  }, [status]);

  return (
    <div className="w-full max-w-2xl mx-auto py-6 px-4">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between relative">
        {steps.map((step, index) => {
          const isCompleted = index <= currentStepIndex;
          const isActive = index === currentStepIndex;

          return (
            <div
              key={step.value}
              className="flex-1 flex flex-col items-center sm:relative"
            >
              {/* Connector lines */}
              {index !== steps.length - 1 && (
                <>
                  {/* Horizontal line for desktop */}
                  <div
                    className={cn(
                      "hidden sm:block absolute top-4 left-1/2 w-full h-0.5 z-0",
                      isCompleted ? "bg-green-500" : "bg-gray-300"
                    )}
                  />
                  {/* Vertical line for mobile */}
                  <div
                    className={cn(
                      "block sm:hidden w-0.5 h-6",
                      isCompleted ? "bg-green-500" : "bg-gray-300"
                    )}
                  />
                </>
              )}

              {/* Step Icon */}
              <div
                className={cn(
                  "z-10 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold",
                  isCompleted
                    ? "bg-green-500"
                    : isActive
                    ? "bg-blue-600"
                    : "bg-gray-300"
                )}
              >
                {step.icon ? (
                  <span className="text-lg">{step.icon}</span>
                ) : (
                  index + 1
                )}
              </div>

              {/* Label */}
              <span
                className={cn(
                  "mt-2 text-xs text-center",
                  isActive ? "text-green-600 font-semibold" : "text-gray-500"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Cancelled or Returned Badge */}
      {cancelledOrReturned && (
        <div className="flex flex-col items-center mt-6 sm:mt-4">
          <PackageX className="text-red-600 w-8 h-8" />
          <span className="text-red-600 text-xs font-semibold mt-2">
            {status === OrderStatus.CANCELLED ? "Cancelled" : "Returned"}
          </span>
        </div>
      )}
    </div>
  );
}
