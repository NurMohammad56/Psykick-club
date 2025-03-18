import mongoose, {Schema} from "mongoose";

const aboutUsSchema = new Schema(
  {
    whoWeAre: { type: String },
    whatWeOffer: { type: String },
    whyChooseUs: { type: String },
    socialLinks: {
      facebook: {
        type: String,
        default: "",
      },
      twitter: {
        type: String,
        default: "",
      },
      instagram: {
        type: String,
        default: "",
      },
      linkedin: {
        type: String,
        default: "",
      },
    },
  },
  { timestamps: true }
);

export const AboutUs = mongoose.model("AboutUs", aboutUsSchema);
