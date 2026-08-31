import {
  createProduct as createProductService,
  getSellerProducts as getSellerProductsService,
  getAllProducts as getAllProductsService,
  getProductDetails as getProductDetailsService,
  addProductVariant as addProductVariantService,
  updateProductVariant as updateProductVariantService,
} from "../services/productService.js";

import asyncHandler from "../utils/asyncHandler.js";

export const createProduct = asyncHandler(async (req, res) => {
  const { title, description, priceAmount, priceCurrency } = req.body;

  const product = await createProductService({
    title,
    description,
    priceAmount,
    priceCurrency,
    files: req.files,
    sellerId: req.user._id,
  });

  res.status(201).json({
    message: "Product created successfully",
    success: true,
    product,
  });
});

export const getSellerProducts = asyncHandler(async (req, res) => {
  const products = await getSellerProductsService(req.user._id);

  res.status(200).json({
    message: "Products fetched successfully",
    success: true,
    products,
  });
});

export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await getAllProductsService(req.query.search);

  res.status(200).json({
    message: "Products fetched successfully",
    success: true,
    products,
  });
});

export const getProductDetails = asyncHandler(async (req, res) => {
  const product = await getProductDetailsService(req.params.id);

  res.status(200).json({
    message: "Product details fetched successfully",
    success: true,
    product,
  });
});

export const addProductVariant = asyncHandler(async (req, res) => {
  const product = await addProductVariantService({
    productId: req.params.productId,
    sellerId: req.user._id,

    title: req.body.title,
    description: req.body.description,
    priceAmount: req.body.priceAmount ?? req.body.price,
    priceCurrency: req.body.priceCurrency,
    stock: req.body.stock,
    attributes: req.body.attributes,

    files: req.files,
  });

  res.status(201).json({
    message: "Product variant added successfully",
    success: true,
    product,
  });
});

export const updateProductVariant = asyncHandler(async (req, res) => {
  const product = await updateProductVariantService({
    productId: req.params.productId,
    variantId: req.params.variantId,
    sellerId: req.user._id,

    title: req.body.title,
    description: req.body.description,
    priceAmount: req.body.priceAmount,
    stock: req.body.stock,
    attributes: req.body.attributes,

    files: req.files,
  });

  res.status(200).json({
    message: "Variant updated successfully",
    success: true,
    product,
  });
});
