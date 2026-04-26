import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  currency: {
    type: String,
    enum: ["USD", "EUR", "JPY", "INR"],
    default: "INR",
  },
  price: {
    amount: {
      type: Number,
      required: true,
    },
  },
  images: [
    {
      url: {
        type: String,
        required: true,
      },
      alt: {
        type: String,
        required: true,
      },
    },
  ],
  variants: [
    {
      title: {
        type: String,
      },
      description: {
        type: String,
      },
      images: [

        {
          url: {
            type: String,
            required: true
          }
        }
      ],
      stock: {
        type: Number,
        required: true,
        default: 0
      },
      attributes: {
        type: Map,
        of: String
      },
      price: {
        amount: {
          type: Number,
          required: true
        },
        currency: {
          type: String,
          enum: ["USD", "EUR", "JPY", "INR"],
          default: "INR",
        }
      }
    }
  ]
}, { timestamps: true });


const productModel = mongoose.model("product", productSchema)
export default productModel