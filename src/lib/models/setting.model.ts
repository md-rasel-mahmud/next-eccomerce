import mongoose, { Document, Model, Schema } from "mongoose";
import z from "zod";

export interface ISetting extends Document {
  banner: {
    title: string;
    description: string;
    bannerImages: string[];
    hasOffer: boolean;
    offer?: {
      title: string;
      description: string;
      amount: number;
    };
  };
  footer: {
    title: string;
    description: string;
    footerImages: string[];
    quickLinks: {
      name: string;
      url: string;
    }[];
  };
  socials: {
    icon: string;
    url: string;
    title: string;
  }[];
}

const SettingSchema: Schema = new Schema<ISetting>(
  {
    banner: {
      title: { type: String, required: true },
      description: { type: String, required: true },
      bannerImages: [{ type: String, required: true }],
      hasOffer: { type: Boolean, default: false },
      offer: {
        title: { type: String, required: false },
        description: { type: String, required: false },
        amount: { type: Number, required: false },
      },
    },
    footer: {
      title: { type: String, required: true },
      description: { type: String, required: true },
      footerImages: [{ type: String, required: true }],
      quickLinks: [
        {
          name: { type: String, required: true },
          url: { type: String, required: true },
        },
      ],
    },
    socials: [
      {
        icon: { type: String, required: true },
        url: { type: String, required: true },
        title: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const settingValidation = (setting: ISetting) => {
  const schema = z.object({
    banner: z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      bannerImages: z.array(z.string()).nonempty(),
      hasOffer: z.boolean(),
      offer: z
        .object({
          title: z.string(),
          description: z.string(),
          amount: z.number().positive(),
        })
        .optional(),
    }),
    footer: z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      footerImages: z.array(z.string()).nonempty(),
      quickLinks: z
        .array(
          z.object({
            name: z.string().min(1),
            url: z.string().url(),
          })
        )
        .nonempty(),
    }),
    socials: z
      .array(
        z.object({
          icon: z.string().min(1),
          url: z.string().url(),
          title: z.string().min(1),
        })
      )
      .nonempty(),
  });

  return schema.parse(setting);
};

const Setting: Model<ISetting> =
  mongoose.models.Setting || mongoose.model<ISetting>("Setting", SettingSchema);

export { Setting, settingValidation };
