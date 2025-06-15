import { PaymentMethods } from "@/enums/PaymentMethods.enum";
import { OrderStatus } from "@/enums/Status.enum";
import {
  CheckoutBackendType,
  CheckoutType,
} from "@/lib/models/checkout/checkout.dto";
import mongoose, { Model, Schema, Types } from "mongoose";

const OrderSchema: Schema = new Schema<CheckoutBackendType>(
  {
    fullName: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
      unique: true,
      minlength: 5,
      maxlength: 50,
    },
    phone: {
      type: String,
      required: true,
      match: /^\+?[0-9]+$/,
    },

    division: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
      match: /^[0-9]+$/,
    },
    address: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: OrderStatus,
      default: OrderStatus.PENDING,
    },
    paymentMethod: {
      type: String,
      enum: PaymentMethods,
      default: PaymentMethods.COD,
    },
    items: [
      {
        productId: {
          type: Types.ObjectId,
          required: true,
          ref: "Product",
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        discount: {
          type: Number,
          default: 0,
          min: 0,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingCharge: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

OrderSchema.index({ slug: 1 });

const Order: Model<CheckoutType> =
  mongoose.models?.Order || mongoose.model<CheckoutType>("Order", OrderSchema);

export { Order, OrderSchema };
