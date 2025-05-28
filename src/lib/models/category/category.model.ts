import { ICategory } from "@/lib/models/category/category.dto";
import mongoose, { Model, Schema } from "mongoose";

const CategorySchema: Schema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    image: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

CategorySchema.index({ slug: 1 });

const Category: Model<ICategory> =
  mongoose.models?.Category ||
  mongoose.model<ICategory>("Category", CategorySchema);

export { Category, CategorySchema };
