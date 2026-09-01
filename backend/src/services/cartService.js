import cartModel from "../models/cartModel.js";
import productModel from "../models/productModel.js";
import AppError from "../errors/AppError.js";

// Build enriched cart response
async function buildCartResponse(cart) {
  let subtotal = 0;
  const enrichedItems = [];

  for (const item of cart.items) {
    const product = await productModel.findById(item.product);

    if (!product) continue;

    const variant = item.variantId
      ? product.variants.id(item.variantId)
      : null;

    // Cart contains a variant that no longer exists
    if (item.variantId && !variant) continue;

    const unitPrice =
      variant?.price?.amount ??
      product.price?.amount ??
      0;

    const currency =
      variant?.price?.currency ??
      product.currency ??
      "INR";

    const lineTotal = unitPrice * item.quantity;

    subtotal += lineTotal;

    enrichedItems.push({
      _id: item._id,
      productId: product._id,
      variantId: variant?._id || null,

      title: product.title,
      description: product.description,

      variantTitle: variant?.title || null,

      attributes: variant?.attributes
        ? variant.attributes instanceof Map
          ? Object.fromEntries(variant.attributes)
          : { ...variant.attributes }
        : {},

      images:
        variant?.images?.length > 0
          ? variant.images
          : product.images,

      price: {
        amount: unitPrice,
        currency,
      },

      lineTotal,
      quantity: item.quantity,

      // Temporary until base-product inventory is implemented
      stock: variant ? variant.stock : 999,
    });
  }

  return {
    _id: cart._id,
    user: cart.user,
    items: enrichedItems,
    subtotal,

    currency:
      enrichedItems[0]?.price?.currency ?? "INR",

    itemCount: enrichedItems.reduce(
      (total, item) => total + item.quantity,
      0,
    ),
  };
}


// GET CART
export async function getCart(userId) {
  const cart = await cartModel.findOne({
    user: userId,
  });

  if (!cart) {
    return {
      items: [],
      subtotal: 0,
      itemCount: 0,
    };
  }

  return buildCartResponse(cart);
}


// ADD TO CART
export async function addToCart({
  userId,
  productId,
  variantId,
  quantity = 1,
}) {
  const product = await productModel.findById(productId);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  let variant = null;

  if (variantId) {
    variant = product.variants.id(variantId);

    if (!variant) {
      throw new AppError("Variant not found", 404);
    }

    if (variant.stock < 1) {
      throw new AppError("Out of stock", 400);
    }

    if (Number(quantity) > variant.stock) {
      throw new AppError(
        `Only ${variant.stock} items available`,
        400,
      );
    }
  }

  let cart = await cartModel.findOne({
    user: userId,
  });

  if (!cart) {
    cart = new cartModel({
      user: userId,
      items: [],
    });
  }

  const existingItem = cart.items.find(
    (item) =>
      item.product.toString() === productId &&
      (
        variantId
          ? item.variantId?.toString() === variantId.toString()
          : !item.variantId
      ),
  );

  if (existingItem) {
    const newQuantity =
      existingItem.quantity + Number(quantity);

    if (variant && newQuantity > variant.stock) {
      throw new AppError(
        `Only ${variant.stock} items available`,
        400,
      );
    }

    existingItem.quantity = newQuantity;
  } else {
    cart.items.push({
      product: productId,
      variantId: variantId || null,
      quantity: Number(quantity),
    });
  }

  await cart.save();

  return buildCartResponse(cart);
}


// UPDATE CART QUANTITY
export async function updateCartQuantity({
  userId,
  productId,
  variantId,
  quantity,
}) {
  const cart = await cartModel.findOne({
    user: userId,
  });

  if (!cart) {
    throw new AppError("Cart not found", 404);
  }

  const item = cart.items.find(
    (item) =>
      item.product.toString() === productId &&
      (
        variantId !== "null" &&
        variantId !== "undefined"
          ? item.variantId?.toString() === variantId
          : !item.variantId
      ),
  );

  if (!item) {
    throw new AppError(
      "Item not found in cart",
      404,
    );
  }

  // Check actual product/variant stock
  const product = await productModel.findById(productId);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  if (item.variantId) {
    const variant = product.variants.id(item.variantId);

    if (!variant) {
      throw new AppError("Variant not found", 404);
    }

    if (Number(quantity) > variant.stock) {
      throw new AppError(
        `Only ${variant.stock} items available`,
        400,
      );
    }
  }

  item.quantity = Number(quantity);

  await cart.save();

  return buildCartResponse(cart);
}


// REMOVE FROM CART
export async function removeFromCart({
  userId,
  productId,
  variantId,
}) {
  const cart = await cartModel.findOne({
    user: userId,
  });

  if (!cart) {
    throw new AppError("Cart not found", 404);
  }

  cart.items = cart.items.filter(
    (item) =>
      !(
        item.product.toString() === productId &&
        (
          variantId !== "null" &&
          variantId !== "undefined"
            ? item.variantId?.toString() === variantId
            : !item.variantId
        )
      ),
  );

  await cart.save();

  return buildCartResponse(cart);
}


// CLEAR CART
export async function clearCart(userId) {
  await cartModel.findOneAndUpdate(
    {
      user: userId,
    },
    {
      items: [],
    },
  );

  return {
    items: [],
    subtotal: 0,
    itemCount: 0,
  };
}