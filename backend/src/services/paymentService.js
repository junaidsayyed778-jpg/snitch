import mongoose from "mongoose";
import crypto from "crypto";

import razorpay from "../config/razorpay.js";
import AppError from "../errors/AppError.js";

import cartModel from "../models/cartModel.js";
import productModel from "../models/productModel.js";
import orderModel from "../models/orderModel.js";
import sellerOrderModel from "../models/sellerOrderModel.js";


// ======================================================
// CREATE RAZORPAY PAYMENT ORDER
// ======================================================

export async function createRazorpayOrder(userId) {
  const cart = await cartModel.findOne({ user: userId });

  if (!cart || cart.items.length === 0) {
    throw new AppError("Cart is empty", 400);
  }

  let subtotal = 0;

  for (const cartItem of cart.items) {
    const product = await productModel.findById(cartItem.product);

    if (!product) {
      throw new AppError(
        "One of the products in your cart no longer exists",
        400,
      );
    }

    let variant = null;

    if (cartItem.variantId) {
      variant = product.variants.id(cartItem.variantId);

      if (!variant) {
        throw new AppError(
          `Variant for ${product.title} no longer exists`,
          400,
        );
      }

      if (variant.stock < cartItem.quantity) {
        throw new AppError(
          `Only ${variant.stock} items available for ${product.title}`,
          400,
        );
      }
    }

    const unitPrice =
      variant?.price?.amount ??
      product?.price?.amount ??
      0;

    subtotal += unitPrice * cartItem.quantity;
  }

  if (subtotal <= 0) {
    throw new AppError("Invalid order amount", 400);
  }

  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(subtotal * 100),
    currency: "INR",
    receipt: `snitch_${userId}_${Date.now()}`,
  });

  return {
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
  };
}


// ======================================================
// VERIFY RAZORPAY PAYMENT
// ======================================================

export async function verifyRazorpayPayment({
  userId,
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}) {

  // ----------------------------------------------------
  // 1. VERIFY RAZORPAY SIGNATURE
  // ----------------------------------------------------

  const generatedSignature = crypto
    .createHmac(
      "sha256",
      process.env.RAZORPAY_KEY_SECRET,
    )
    .update(
      `${razorpayOrderId}|${razorpayPaymentId}`,
    )
    .digest("hex");

  if (generatedSignature !== razorpaySignature) {
    throw new AppError(
      "Payment verification failed",
      400,
    );
  }


  // ----------------------------------------------------
  // 2. START DATABASE TRANSACTION
  // ----------------------------------------------------

  const session = await mongoose.startSession();

  let createdOrder;

  try {

    await session.withTransaction(async () => {

      // ------------------------------------------------
      // GET CART
      // ------------------------------------------------

      const cart = await cartModel
        .findOne({ user: userId })
        .session(session);

      if (!cart || cart.items.length === 0) {
        throw new AppError("Cart is empty", 400);
      }


      // ------------------------------------------------
      // PREPARE ORDER DATA
      // ------------------------------------------------

      const orderItems = [];

      const sellerOrderMap = new Map();

      let subtotal = 0;


      // ------------------------------------------------
      // PROCESS CART ITEMS
      // ------------------------------------------------

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


        // ----------------------------------------------
        // FIND VARIANT
        // ----------------------------------------------

        let variant = null;

        if (cartItem.variantId) {

          variant = product.variants.id(
            cartItem.variantId,
          );

          if (!variant) {
            throw new AppError(
              `Variant for ${product.title} no longer exists`,
              400,
            );
          }


          // --------------------------------------------
          // CHECK STOCK
          // --------------------------------------------

          if (variant.stock < cartItem.quantity) {
            throw new AppError(
              `Only ${variant.stock} items available for ${product.title}`,
              400,
            );
          }
        }


        // ----------------------------------------------
        // CALCULATE PRICE
        // ----------------------------------------------

        const unitPrice =
          variant?.price?.amount ??
          product?.price?.amount ??
          0;

        const lineTotal =
          unitPrice * cartItem.quantity;

        subtotal += lineTotal;


        // ----------------------------------------------
        // PRODUCT IMAGE
        // ----------------------------------------------

        const image =
          variant?.images?.[0]?.url ??
          product?.images?.[0]?.url ??
          null;


        // ----------------------------------------------
        // MAIN ORDER ITEM
        // ----------------------------------------------

        orderItems.push({
          product: product._id,

          seller: product.seller,

          variantId: variant?._id ?? null,

          title: product.title,

          variantTitle:
            variant?.title ?? null,

          image,

          quantity: cartItem.quantity,

          price: {
            amount: unitPrice,
            currency: "INR",
          },

          lineTotal,
        });


        // ----------------------------------------------
        // GROUP ITEMS BY SELLER
        // ----------------------------------------------

        const sellerId =
          product.seller.toString();

        if (!sellerOrderMap.has(sellerId)) {

          sellerOrderMap.set(sellerId, {
            seller: product.seller,
            items: [],
            subtotal: 0,
          });
        }

        const sellerOrderData =
          sellerOrderMap.get(sellerId);


        sellerOrderData.items.push({

          product: product._id,

          variantId:
            variant?._id ?? null,

          variantTitle:
            variant?.title ?? null,

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


        // ----------------------------------------------
        // DECREASE STOCK
        // ----------------------------------------------

        if (variant) {

          variant.stock -= cartItem.quantity;

          product.markModified("variants");
        }

        await product.save({
          session,
        });
      }


      // ------------------------------------------------
      // VALIDATE TOTAL
      // ------------------------------------------------

      if (subtotal <= 0) {
        throw new AppError(
          "Invalid order amount",
          400,
        );
      }


      // ------------------------------------------------
      // CREATE MAIN ORDER
      // ------------------------------------------------

      const [order] =
        await orderModel.create(
          [
            {
              user: userId,

              items: orderItems,

              subtotal,

              currency: "INR",

              status: "paid",

              paymentStatus: "paid",

              razorpayOrderId,

              razorpayPaymentId,

              razorpaySignature,
            },
          ],
          {
            session,
          },
        );


      createdOrder = order;


      // ------------------------------------------------
      // CREATE SELLER ORDERS
      // ------------------------------------------------

      for (
        const sellerOrderData
        of sellerOrderMap.values()
      ) {

        await sellerOrderModel.create(
          [
            {
              order: order._id,

              buyer: userId,

              seller:
                sellerOrderData.seller,

              items:
                sellerOrderData.items,

              subtotal:
                sellerOrderData.subtotal,

              currency: "INR",

              status: "pending",
            },
          ],
          {
            session,
          },
        );
      }


      // ------------------------------------------------
      // CLEAR CART
      // ------------------------------------------------

      cart.items = [];

      await cart.save({
        session,
      });
    });


    // --------------------------------------------------
    // RETURN CREATED ORDER
    // --------------------------------------------------

    return createdOrder;

  } finally {

    await session.endSession();
  }
}

