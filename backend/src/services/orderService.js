import mongoose from "mongoose";
import orderModel from "../models/orderModel.js";
import cartModel from "../models/cartModel.js";
import productModel from "../models/productModel.js";
import AppError from "../errors/AppError.js";

// CREATE ORDER
export async function createOrder(userId) {
  const session = await mongoose.startSession();

  try {
    let createdOrder;

    await session.withTransaction(async () => {
      // 1. Get user's cart
      const cart = await cartModel.findOne({ user: userId }).session(session);

      if (!cart || cart.items.length === 0) {
        throw new AppError("Cart is empty", 400);
      }

      const orderItems = [];
      let subtotal = 0;

      // 2. Validate every cart item
      for (const cartItem of cart.items) {
        const product = await productModel
          .findById(cartItem.product)
          .session(session);

        if (!product) {
          throw new AppError(
            "One of the products in your cart no longer exists",
            400,
          );
        }

        let variant = null;

        // 3. Get variant if cart item has one
        if (cartItem.variantId) {
          variant = product.variants.id(cartItem.variantId);

          if (!variant) {
            throw new AppError(
              `Variant for ${product.title} no longer exists`,
              400,
            );
          }

          // 4. Check stock
          if (variant.stock < cartItem.quantity) {
            throw new AppError(
              `Only ${variant.stock} items available for ${product.title}`,
              400,
            );
          }
        }

        // 5. SERVER-SIDE price
        const unitPrice = 
        variant?.price?.amount ?? 
        product.price?.amount ?? 
        0;

        const lineTotal = unitPrice * cartItem.quantity;

        subtotal += lineTotal;

        // 6. Take image snapshot
        const image =
          variant?.images?.[0]?.url ?? product.images?.[0]?.url ?? null;

        // 7. Create order item snapshot
        orderItems.push({
          product: product._id,
          seller: product.seller,
          variantId: variant?._id ?? null,

          title: product.title,
          variantTitle: variant?.title ?? null,

          image,
          quantity: cartItem.quantity,

          price: {
            amount: unitPrice,
            currency: "INR",
          },

          lineTotal,
        });

        // 8. Reduce variant stock
        if (variant) {
          variant.stock -= cartItem.quantity;
        }

        product.markModified("variants");

        await product.save({ session });
      }

      // 9. Create order
      const [order] = await orderModel.create(
        [
          {
            user: userId,
            items: orderItems,
            subtotal,
            currency: "INR",
            status: "pending",
            paymentStatus: "pending",
          },
        ],
        { session },
      );

      createdOrder = order;

      // 10. Clear cart
      cart.items = [];

      await cart.save({ session });
    });

    return createdOrder;
  } finally {
    await session.endSession();
  }
}

// GET USER ORDERS
export async function getUserOrders(userId) {
  return orderModel.find({ user: userId }).sort({ createdAt: -1 });
}

// GET SINGLE ORDER
export async function getOrderById({ orderId, userId }) {
  const order = await orderModel.findOne({
    _id: orderId,
    user: userId,
  });

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  return order;
}
