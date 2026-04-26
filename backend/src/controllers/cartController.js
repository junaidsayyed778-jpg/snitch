import cartModel from "../models/cartModel.js";
import productModel from "../models/productModel.js";

// Helper: build enriched cart response with server-side totals
async function buildCartResponse(cart) {
  let subtotal = 0;
  const enrichedItems = [];

  for (const item of cart.items) {
    const product = await productModel.findById(item.product);
    if (!product) continue;

    const variant = item.variantId ? product.variants.id(item.variantId) : null;
    
    // If a variant is specified in the cart item but not found on the product, skip it
    if (item.variantId && !variant) continue;

    const unitPrice =
      variant?.price?.amount ?? product.price?.amount ?? 0;
    const currency =
      variant?.price?.currency ?? product.currency ?? "INR";
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
        ? (variant.attributes instanceof Map
            ? Object.fromEntries(variant.attributes)
            : { ...variant.attributes })
        : {},
      images:
        variant?.images?.length > 0 ? variant.images : product.images,
      price: {
        amount: unitPrice,
        currency,
      },
      lineTotal,
      quantity: item.quantity,
      stock: variant ? variant.stock : 999, // Fallback high stock if no variant tracking
    });
  }

  return {
    _id: cart._id,
    user: cart.user,
    items: enrichedItems,
    subtotal,
    currency: enrichedItems[0]?.price?.currency ?? "INR",
    itemCount: enrichedItems.reduce((acc, i) => acc + i.quantity, 0),
  };
}

// GET /api/cart
export async function getCart(req, res) {
  try {
    let cart = await cartModel.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(200).json({
        success: true,
        cart: { items: [], subtotal: 0, itemCount: 0 },
      });
    }

    const enriched = await buildCartResponse(cart);
    return res.status(200).json({ success: true, cart: enriched });
  } catch (err) {
    console.error("getCart error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch cart", error: err.message });
  }
}

// POST /api/cart   body: { productId, variantId, quantity? }
export async function addToCart(req, res) {
  try {
    const { productId, variantId, quantity = 1 } = req.body;

    // Validate product exist
    const product = await productModel.findById(productId);
    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });

    // If variantId is provided, validate it exists
    let variant = null;
    if (variantId) {
      variant = product.variants.id(variantId);
      if (!variant)
        return res.status(404).json({ success: false, message: "Variant not found" });
      
      if (variant.stock < 1)
        return res.status(400).json({ success: false, message: "Out of stock" });
    }

    let cart = await cartModel.findOne({ user: req.user._id });
    if (!cart) {
      cart = new cartModel({ user: req.user._id, items: [] });
    }

    const existingItem = cart.items.find(
      (i) =>
        i.product.toString() === productId &&
        (variantId ? i.variantId?.toString() === variantId.toString() : !i.variantId)
    );

    if (existingItem) {
      existingItem.quantity += Number(quantity);
    } else {
      cart.items.push({ product: productId, variantId: variantId || null, quantity: Number(quantity) });
    }

    await cart.save();

    const enriched = await buildCartResponse(cart);
    return res
      .status(200)
      .json({ success: true, message: "Added to cart", cart: enriched });
  } catch (err) {
    console.error("addToCart error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to add to cart", error: err.message });
  }
}

// PATCH /api/cart/:productId/:variantId   body: { quantity }
export async function updateCartQuantity(req, res) {
  try {
    const { productId, variantId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1)
      return res.status(400).json({ success: false, message: "Invalid quantity" });

    const cart = await cartModel.findOne({ user: req.user._id });
    if (!cart)
      return res.status(404).json({ success: false, message: "Cart not found" });

    const item = cart.items.find(
      (i) =>
        i.product.toString() === productId &&
        (variantId !== "null" && variantId !== "undefined" ? i.variantId?.toString() === variantId : !i.variantId)
    );

    if (!item)
      return res.status(404).json({ success: false, message: "Item not found in cart" });

    item.quantity = Number(quantity);
    await cart.save();

    const enriched = await buildCartResponse(cart);
    return res
      .status(200)
      .json({ success: true, message: "Quantity updated", cart: enriched });
  } catch (err) {
    console.error("updateCartQuantity error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to update quantity", error: err.message });
  }
}

// DELETE /api/cart/:productId/:variantId
export async function removeFromCart(req, res) {
  try {
    const { productId, variantId } = req.params;

    const cart = await cartModel.findOne({ user: req.user._id });
    if (!cart)
      return res.status(404).json({ success: false, message: "Cart not found" });

    cart.items = cart.items.filter(
      (i) =>
        !(
          i.product.toString() === productId &&
          (variantId !== "null" && variantId !== "undefined" ? i.variantId?.toString() === variantId : !i.variantId)
        )
    );

    await cart.save();

    const enriched = await buildCartResponse(cart);
    return res
      .status(200)
      .json({ success: true, message: "Item removed", cart: enriched });
  } catch (err) {
    console.error("removeFromCart error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to remove item", error: err.message });
  }
}

// DELETE /api/cart
export async function clearCart(req, res) {
  try {
    await cartModel.findOneAndUpdate(
      { user: req.user._id },
      { items: [] },
      { new: true }
    );
    return res
      .status(200)
      .json({ success: true, message: "Cart cleared", cart: { items: [], subtotal: 0, itemCount: 0 } });
  } catch (err) {
    console.error("clearCart error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to clear cart", error: err.message });
  }
}
