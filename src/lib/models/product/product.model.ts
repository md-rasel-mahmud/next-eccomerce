import { IProduct } from "@/lib/models/product/product.dto";
import mongoose, { Model, Schema, Types } from "mongoose";

const ProductSchema: Schema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    images: [{ type: String }],
    category: { type: Types.ObjectId, required: true, ref: "Category" },
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

ProductSchema.index({ category: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ stockQuantity: 1 });

const Product: Model<IProduct> =
  mongoose.models?.Product ||
  mongoose.model<IProduct>("Product", ProductSchema);

export { Product };
