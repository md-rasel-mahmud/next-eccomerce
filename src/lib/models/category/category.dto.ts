import z from "zod";

export interface ICategory {
  name: string;
  slug: string;
  description: string;
  image: string;
}

export type CategoryTypeWithId = ICategory & {
  _id: string;
};

const CATEGORY_DEFAULT_VALUES: Partial<ICategory> = {
  name: "",
  slug: "",
  description: "",
  image: "",
};

const categoryValidation = z.object({
  name: z
    .string()
    .min(2, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(100, "Slug must be less than 100 characters"),
  description: z.string().optional(),
  image: z.string().optional(),
});

export { CATEGORY_DEFAULT_VALUES, categoryValidation };
