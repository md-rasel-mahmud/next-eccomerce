import z from "zod";

export interface IShipping {
  name: string;
  charge: number;
  duration?: string;
  description?: string;
}

export type ShippingTypeWithId = IShipping & {
  _id: string;
};

const SHIPPING_DEFAULT_VALUES: Partial<IShipping> = {
  name: "",
  charge: 0,
  description: "",
  duration: "3-5 business days",
};

const shippingValidation = z.object({
  name: z.string().min(1, "Name is required"),
  charge: z.number().min(0, "Charge must be a non-negative number"),
  duration: z.string().optional(),
  description: z.string().optional(),
});

export { SHIPPING_DEFAULT_VALUES, shippingValidation };
