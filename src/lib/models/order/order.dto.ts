import { PaymentMethods } from "@/enums/PaymentMethods.enum";
import { OrderStatus } from "@/enums/Status.enum";
import z from "zod";

export interface IOrder {
  status: OrderStatus;
  orderId: string;
  fullName: string;
  phone: string;
  division: string;
  district: string;
  postalCode: string;
  address: string;
  paymentMethod: string;
  totalAmount: number;
  shippingCharge: number;
  createdAt: string;
  updatedAt: string;
  items: Array<{
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
  }>;
  _id?: string;
}

export type OrderTypeWithId = IOrder & {
  _id: string;
};

const ORDER_DEFAULT_VALUES: Partial<IOrder> = {
  status: OrderStatus.PENDING,
  orderId: "",
  fullName: "",
  phone: "",
  division: "",
  district: "",
  postalCode: "",
  address: "",
  paymentMethod: PaymentMethods.COD,
  totalAmount: 0,
  shippingCharge: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  items: [],
};

const orderValidation = z.object({
  status: z.nativeEnum(OrderStatus).optional(),
  orderId: z.string().min(1, "Order ID is required").optional(),
  fullName: z.string().min(1, "Full name is required").optional(),
  phone: z.string().min(1, "Phone number is required").optional(),
  division: z.string().min(1, "Division is required").optional(),
  district: z.string().min(1, "District is required").optional(),
  postalCode: z.string().min(1, "Postal code is required").optional(),
  address: z.string().min(1, "Address is required").optional(),
  paymentMethod: z.string().min(1, "Payment method is required").optional(),
  totalAmount: z
    .number()
    .min(0, "Total amount must be a positive number")
    .optional(),
  shippingCharge: z
    .number()
    .min(0, "Shipping charge must be a positive number")
    .optional(),
  createdAt: z.string().datetime({ message: "Invalid date format" }).optional(),
  updatedAt: z.string().datetime({ message: "Invalid date format" }).optional(),
  items: z
    .array(
      z.object({
        productId: z.object({
          _id: z.string().uuid("Invalid product ID"),
          name: z.string().min(1, "Product name is required"),
          slug: z.string().min(1, "Product slug is required"),
          description: z.string().optional(),
          price: z.number().nonnegative("Price must be a non-negative number"),
          discount: z
            .number()
            .nonnegative("Discount must be a non-negative number"),
          images: z.array(z.string()).optional(),
          category: z.string().uuid("Invalid category ID"),
          tags: z.array(z.string()).optional(),
          badge: z.string().optional(),
          stockQuantity: z
            .number()
            .nonnegative("Stock quantity must be a non-negative number"),
          averageRating: z
            .number()
            .nonnegative("Average rating must be a non-negative number")
            .max(5),
          totalReviews: z
            .number()
            .nonnegative("Total reviews must be a non-negative number"),
          isFeatured: z.boolean().optional(),
          isSeasonal: z.boolean().optional(),
          createdAt: z
            .string()
            .datetime({ message: "Invalid date format" })
            .optional(),
          updatedAt: z
            .string()
            .datetime({ message: "Invalid date format" })
            .optional(),
        }),
        quantity: z
          .number()
          .int()
          .positive("Quantity must be a positive integer"),
        price: z.number().nonnegative("Price must be a non-negative number"),
        discount: z
          .number()
          .nonnegative("Discount must be a non-negative number"),
        _id: z.string().uuid("Invalid item ID"),
      })
    )
    .optional(),
});

export { ORDER_DEFAULT_VALUES, orderValidation };
