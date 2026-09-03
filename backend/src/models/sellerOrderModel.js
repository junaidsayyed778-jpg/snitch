import mongoose from "mongoose";

const sellerOrderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
    variantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      default: null,
    },
    variantTitle: {
      type: String,
      default: null,
    },
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
      },
    },

    lineTotal: {
      type: Number,
      required: true,
      min: [0, "Line total must be at least 0"],
    },
  },
  {
    _id: true,
  },
);

const sellerOrderSchema = new mongoose.Schema({
  // original buyer order
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "order",
    required: true,
  },

  //buyer
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },

  // seller respnsible for this order
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  // Product belonging to this seller
  items: {
    type: [sellerOrderItemSchema],
    required: true,

    validate: {
      validator: (items) => items.length > 0,
      message: "Seller order must have at least one item",
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

  // Seller fulfilment status
  status: {
    type: String,
    required: true,
  enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
    default: "pending",
  }
},{timestamps: true});

const sellerOrderModel = mongoose.model("sellerOrder", sellerOrderSchema);
export default sellerOrderModel;
