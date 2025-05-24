import mongoose, { Document, Model, Schema } from "mongoose";
import z from "zod";

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  discount: number;
  images: string[];
  categoryId: string;
  tags: string[];
  badge: string;
  isFeatured: boolean;
  isSeasonal: boolean;
  stockQuantity: number;
  averageRating: number;
  totalReviews: number;
}

const PRODUCT_DEFAULT_VALUES: Partial<IProduct> = {
  name: "",
  slug: "",
  description: "",
  price: 0,
  discount: 0,
  images: [],
  categoryId: "",
  tags: [],
  badge: "",
  isFeatured: false,
  isSeasonal: false,
  stockQuantity: 0,
  averageRating: 0,
  totalReviews: 0,
};

const ProductSchema: Schema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    images: [{ type: String }],
    categoryId: { type: String, required: true },
    tags: [{ type: String }],
    badge: { type: String },
    stockQuantity: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isSeasonal: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

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
  images: z
    .array(z.string().url("Image URL must be a valid URL"))
    .optional()
    .default([]),
  categoryId: z.string().min(1, "Category ID is required"),
  tags: z.array(z.string()).optional(),
  badge: z.string().optional(),
  stockQuantity: z.number().default(0),
  averageRating: z.number().default(0),
  totalReviews: z.number().default(0),
  isFeatured: z.boolean().default(false),
  isSeasonal: z.boolean().default(false),
});

const Product: Model<IProduct> =
  mongoose.models?.Product ||
  mongoose.model<IProduct>("Product", ProductSchema);

export { Product, productValidation, PRODUCT_DEFAULT_VALUES };
