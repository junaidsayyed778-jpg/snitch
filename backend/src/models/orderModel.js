import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },

    variantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },

    variantTitle: {
      type: String,
      default: null,
    },

    // Snapshot of product information at purchase time
    title: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: null,
    },

    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
    },

    price: {
      amount: {
        type: Number,
        required: true,
        min: [0, "Price amount must be at least 0"],
      },

      currency: {
        type: String,
        required: true,
        default: "INR",
        enum: ["INR"],
      },
    },

    lineTotal: {
      type: Number,
      required: true,
      min: [0, "Line total must be at least 0"],
    },
  },
  {
    id: true,
  },
);

const orderSchema = new mongoose.Schema(
  {
    // Buyer who created the order
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    // Products purchased in this order
    items: {
      type: [orderItemSchema],
      required: true,

      validate: {
        validator: (items) => items.length > 0,
        message: "Order must have at least one item",
      },
    },

    subtotal: {
      type: Number,
      required: true,
      min: [0, "Subtotal must be at least 0"],
    },

    currency: {
      type: String,
      required: true,
      default: "INR",
      enum: ["INR"],
    },

    // Overall buyer order status
    status: {
      type: String,
      enum: ["pending", "paid", "cancelled", "completed"],
      default: "pending",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

const orderModel = mongoose.model("order", orderSchema);

export default orderModel;
