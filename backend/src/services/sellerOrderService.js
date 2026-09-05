import AppError from "../errors/AppError.js";
import sellerOrderModel from "../models/sellerOrderModel.js";
import productModel from "../models/productModel.js";
import { getIO } from "../socket.js";
const allowedStatusTransitions = {
  pending: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};
export async function getSellerOrders(sellerId) {
  return sellerOrderModel.find({ seller: sellerId }).sort({ createdAt: -1 });
}
export async function getSellerOrderById({ sellerOrderId, sellerId }) {
  const sellerOrder = await sellerOrderModel.findOne({
    _id: sellerOrderId,
    seller: sellerId,
  });

  if (!sellerOrder) {
    throw new AppError("Seller order not found", 404);
  }

  return sellerOrder;
}

export async function updateSellerOrderStatus({
  sellerOrderId,
  sellerId,
  newStatus,
}) {
  const sellerOrder = await sellerOrderModel.findOne({
    _id: sellerOrderId,
    seller: sellerId,
  });

  if (!sellerOrder) {
    throw new AppError("Seller order not found", 404);
  }

  const currentStatus = sellerOrder.status;

  const allowedStatuses = allowedStatusTransitions[currentStatus];

  if (!allowedStatuses.includes(newStatus)) {
    throw new AppError(
      `Cannot change order status from ${currentStatus} to ${newStatus}`,
    );
  }

  sellerOrder.status = newStatus;

  await sellerOrder.save();

  const io = getIO();

  io.to(`user:${sellerOrder.buyer}`).emit("order:status-updated", {
    sellerOrderId: sellerOrder.order,
    orderId: sellerOrder.order,
    sellerId: sellerOrder.seller,
    status: sellerOrder.status,
  });

  return sellerOrder;
}

export async function cancelSellerOrder({ sellerOrderId, buyerId }) {
  const sellerOrder = await sellerOrderModel.findOne({
    _id: sellerOrderId,
    buyer: buyerId,
  });

  if (!sellerOrder) {
    throw new AppError("Order not found: ", 404);
  }

  if (sellerOrder.status !== "pending") {
    throw new AppError(
      `Order cannot be cancelled because its current status is ${sellerOrder.status}`,
      400,
    );
  }

  for (const item of sellerOrder.items) {
    const product = await productModel.findById(item.product);

    if (!product) {
      continue;
    }

    if (item.variantId) {
      const variant = product.variants.id(item.variantId);

      if (variant) {
        variant.stock += item.quantity;
        product.markModified("variants");
        await product.save();
      }
    }
  }

  sellerOrder.status = "cancelled";

  await sellerOrder.save();

  const io = getIO();

  io.to(`user:${sellerOrder.buyer}`).emit("order:status-updated", {
    sellerOrderId: sellerOrder._id,
    orderId: sellerOrder.order,
    sellerId: sellerOrder.seller,
    status: sellerOrder.status,
  });

  return sellerOrder;
}
