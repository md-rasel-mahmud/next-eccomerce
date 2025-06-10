import { PaymentMethods } from "@/enums/PaymentMethods.enum";
import { Status } from "@/enums/Status.enum";
import z from "zod";

const CHECKOUT_DEFAULT_VALUES = {
  fullName: "",
  phone: "",
  shipping: "",
  division: "",
  district: "",
  postalCode: "",
  address: "",
};

const checkoutValidationBackend = z
  .object({
    fullName: z
      .string()
      .min(2, "Full name is required")
      .max(100, "Full name must be less than 100 characters"),
    phone: z
      .string()
      .min(10, "Phone number is required")
      .max(15, "Phone number must be less than 15 characters")
      .regex(/^\+?[0-9]+$/, "Phone number must be a valid number"),
    division: z
      .string()
      .min(2, "Division is required")
      .max(100, "Division must be less than 100 characters"),
    district: z
      .string()
      .min(2, "District is required")
      .max(100, "District must be less than 100 characters"),
    postalCode: z
      .string()
      .min(2, "Postal code is required")
      .max(20, "Postal code must be less than 20 characters")
      .regex(/^[0-9]+$/, "Postal code must be a valid number"),
    address: z
      .string()
      .min(5, "Address is required")
      .max(200, "Address must be less than 200 characters"),
    status: z
      .string()
      .optional()
      .default(Status.PENDING)
      .refine((val) => Object.values(Status).includes(val as Status), {
        message: "Invalid order status",
      }),
    paymentMethod: z
      .string()
      .optional()
      .default(PaymentMethods.COD)
      .refine(
        (val) => Object.values(PaymentMethods).includes(val as PaymentMethods),
        {
          message: "Invalid payment method",
        }
      ),
    orderId: z
      .string()
      .min(1, "Order ID is required")
      .max(50, "Order ID must be less than 50 characters"),
    items: z
      .array(
        z.object({
          productId: z.string().min(1, "Product ID is required"),
          quantity: z
            .number()
            .min(1, "Quantity must be at least 1")
            .max(100, "Quantity must be less than or equal to 100"),
          price: z.number().min(0, "Price must be a positive number"),
          discount: z.number().optional().default(0),
        })
      )
      .min(1, "At least one item is required in the order"),
    totalAmount: z.number().min(0, "Total amount must be a positive number"),
    shippingCharge: z
      .number()
      .min(0, "Shipping charge must be a positive number"),
  })
  .refine(
    (data) => {
      // Ensure totalAmount is calculated correctly
      const calculatedTotal = data.items.reduce(
        (sum, item) => sum + item.price * item.quantity - item.discount,
        0
      );
      return data.totalAmount === calculatedTotal + data.shippingCharge;
    },
    {
      message: "Total amount does not match calculated total",
    }
  );

const checkoutValidation = z.object({
  fullName: z
    .string()
    .min(2, "Full name is required")
    .max(100, "Full name must be less than 100 characters"),
  phone: z
    .string()
    .min(10, "Phone number is required")
    .max(15, "Phone number must be less than 15 characters")
    .regex(/^\+?[0-9]+$/, "Phone number must be a valid number"),
  shipping: z.string().min(2, "Shipping method is required"),
  division: z
    .string()
    .min(2, "Division is required")
    .max(100, "Division must be less than 100 characters"),
  district: z
    .string()
    .min(2, "District is required")
    .max(100, "District must be less than 100 characters"),
  postalCode: z
    .string()
    .min(2, "Postal code is required")
    .max(20, "Postal code must be less than 20 characters")
    .regex(/^[0-9]+$/, "Postal code must be a valid number"),
  address: z
    .string()
    .min(5, "Address is required")
    .max(200, "Address must be less than 200 characters"),
});

export type CheckoutType = z.infer<typeof checkoutValidation>;
export type CheckoutBackendType = z.infer<typeof checkoutValidationBackend>;

export {
  CHECKOUT_DEFAULT_VALUES,
  checkoutValidation,
  checkoutValidationBackend,
};
