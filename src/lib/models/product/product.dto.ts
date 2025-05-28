import z from "zod";

export interface IProduct {
  name: string;
  slug: string;
  description: string;
  price: number;
  discount: number;
  images: string[];
  category:
    | string
    | {
        name: string;
        slug: string;
        _id: string;
        image?: string;
      };
  tags: string[];
  badge: string;
  isFeatured: boolean;
  isSeasonal: boolean;
  stockQuantity: number;
  averageRating: number;
  totalReviews: number;
}

export type ProductTypeWithId = IProduct & {
  _id: string;
};

const PRODUCT_DEFAULT_VALUES: Partial<IProduct> = {
  name: "",
  slug: "",
  description: "",
  price: 0,
  discount: 0,
  images: [],
  category: "",
  tags: [],
  badge: "",
  isFeatured: false,
  isSeasonal: false,
  stockQuantity: 0,
  averageRating: 0,
  totalReviews: 0,
};

const productValidation = z.object({
  name: z
    .string()
    .min(2, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(100, "Slug must be less than 100 characters"),
  description: z.string(),
  price: z
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a number",
    })
    .min(0, "Price must be a positive number"),
  discount: z
    .number({
      required_error: "Discount is required",
      invalid_type_error: "Discount must be a number",
    })
    .min(0, "Discount must be a positive number"),
  images: z.array(z.string()).optional().default([]),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).optional(),
  badge: z.string().optional(),
  stockQuantity: z.number().default(0),
  averageRating: z.number().default(0),
  totalReviews: z.number().default(0),
  isFeatured: z.boolean().default(false),
  isSeasonal: z.boolean().default(false),
});

export { PRODUCT_DEFAULT_VALUES, productValidation };
