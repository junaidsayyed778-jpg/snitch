import mongoose from "mongoose";
import orderModel from "../models/orderModel.js";
import cartModel from "../models/cartModel.js";
import productModel from "../models/productModel.js";
import sellerOrderModel from "../models/sellerOrderModel.js";
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
      const sellerOrdersMap = new Map();
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
        const unitPrice = variant?.price?.amount ?? product.price?.amount ?? 0;

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

        const sellerId = product.seller.toString();

        if (!sellerOrdersMap.has(sellerId)) {
          sellerOrdersMap.set(sellerId, {
            seller: product.seller,
            items: [],
            subtotal: 0,
          });
        }

        const sellerOrderData = sellerOrdersMap.get(sellerId);

        sellerOrderData.items.push({
          product: product._id,
          variantId: variant?._id ?? null,
          variantTitle: variant?.title ?? null,

          title: product.title,
          image,
          quantity: cartItem.quantity,

          price: {
            amount: unitPrice,
            currency: "INR",
          },

          lineTotal,
        });

        sellerOrderData.subtotal += lineTotal;

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
      for (const sellerOrderData of sellerOrdersMap.values()) {
        await sellerOrderModel.create(
          [
            {
              order: order._id,
              buyer: userId,
              seller: sellerOrderData.seller,
              items: sellerOrderData.items,
              subtotal: sellerOrderData.subtotal,
              currency: "INR",
              status: "pending",
            },
          ],
          { session },
        );
      }

      //11. Clear cart items
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
  const orders = await orderModel
    .find({ user: userId })
    .sort({ createdAt: -1 });

  const orderIds = orders.map((order) => order._id);

  const sellerOrders = await sellerOrderModel.find({
    order: { $in: orderIds },
  });

  return orders.map((order) => {
    const orderSellerOrders = sellerOrders.filter(
      (sellerOrder) =>
        sellerOrder.order.toString() === order._id.toString(),
    );

    const items = order.items.map((item) => {
      const sellerOrder = orderSellerOrders.find(
        (sellerOrder) =>
          sellerOrder.seller.toString() === item.seller.toString(),
      );

      return {
        ...item.toObject(),
        status: sellerOrder?.status ?? item.status,
      };
    });

    return {
      ...order.toObject(),
      items,
      sellerOrders: orderSellerOrders,
    };
  });
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
