import AppError from "../errors/AppError.js";
import productModel from "../models/productModel.js";
import { uploadFile } from "./storageService.js";

export async function createProduct({
  title,
  description,
  priceAmount,
  priceCurrency,
  files,
  sellerId,
}) {
  if (!files || files.length === 0) {
    throw new AppError("At least one image is required", 400);
  }

  const images = await Promise.all(
    files.map((file) =>
      uploadFile({
        buffer: file.buffer,
        fileName: file.originalname,
      }),
    ),
  );

  const product = await productModel.create({
    title,
    description,
    price: {
      amount: Number(priceAmount),
    },
    currency: priceCurrency || "INR",
    images,
    seller: sellerId,
  });

  return product;
}

export async function getSellerProducts(sellerId) {
  return productModel.find({ seller: sellerId }).sort({ _id: -1 });
}

export async function getAllProducts(search) {
  const query = {};
  if (search) {
    query.$or = [
      {
        title: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  return productModel.find(query).sort({ _id: -1 });
}

export async function getProductDetails(productId) {
  const product = await productModel.findById(productId);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  return product;
}


export async function addProductVariant({
  productId,
  sellerId,
  title,
  description,
  priceAmount,
  priceCurrency,
  stock,
  attributes,
  files,
}) {
  const product = await productModel.findOne({
    _id: productId,
    seller: sellerId,
  });

  if (!product) {
    throw new AppError("Product not found or unauthorized", 404);
  }

  let images = [];

  if (files?.length > 0) {
    images = await Promise.all(
      files.map((file) =>
        uploadFile({
          buffer: file.buffer,
          fileName: file.originalname,
        }),
      ),
    );
  }

  let parsedAttributes = {};

  if (attributes) {
    try {
      parsedAttributes =
        typeof attributes === "string"
          ? JSON.parse(attributes)
          : attributes;
    } catch {
      throw new AppError("Invalid attributes format", 400);
    }
  }

  product.variants.push({
    title,
    description,
    images,
    price: {
      amount: Number(priceAmount ?? product.price.amount),
      currency: priceCurrency || product.currency || "INR",
    },
    stock: Number(stock ?? 0),
    attributes: parsedAttributes,
  });

  await product.save();

  return product;
}

export async function updateProductVariant({
  productId,
  variantId,
  sellerId,
  title,
  description,
  priceAmount,
  stock,
  attributes,
  files,
}) {
  const product = await productModel.findOne({
    _id: productId,
    seller: sellerId,
  });

  if (!product) {
    throw new AppError("Product not found or unauthorized", 404);
  }

  const variant = product.variants.id(variantId);

  if (!variant) {
    throw new AppError("Variant not found", 404);
  }

  if (files?.length > 0) {
    const uploadResults = await Promise.all(
      files.map((file) =>
        uploadFile({
          buffer: file.buffer,
          fileName: file.originalname,
        }),
      ),
    );

    variant.images = uploadResults;
  }

  if (title !== undefined) {
    variant.title = title;
  }

  if (description !== undefined) {
    variant.description = description;
  }

  if (stock !== undefined) {
    variant.stock = Number(stock);
  }

  if (priceAmount !== undefined) {
    variant.set("price.amount", Number(priceAmount));
  }

  if (attributes !== undefined) {
    try {
      const parsedAttributes =
        typeof attributes === "string"
          ? JSON.parse(attributes)
          : attributes;

      variant.set("attributes", parsedAttributes);
    } catch {
      throw new AppError("Invalid attributes format", 400);
    }
  }

  product.markModified("variants");

  await product.save();

  return product;
}
