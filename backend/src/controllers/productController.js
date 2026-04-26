// backend/src/controllers/productController.js
import productModel from "../models/productModel.js";
import { uploadFile } from "../services/storageService.js";

export async function createProduct(req, res) {
  try {
    const { title, description, priceAmount, priceCurrency } = req.body;
    const seller = req.user;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "At least one image is required" });
    }

    const images = [];
    for (const file of req.files) {
      const uploadResult = await uploadFile({
        buffer: file.buffer,
        fileName: file.originalname
      });
      images.push(uploadResult);
    }

    const product = new productModel({
      title,
      description,
      price: {
        amount: Number(priceAmount)
      },
      currency: priceCurrency || "INR",
      images,
      seller: seller._id,
    });

    await product.save();

    res.status(201).json({
      message: "Product created successfully",
      success: true,
      product,
    });
  } catch (err) {
    console.error("Product creation error:", err);
    res.status(500).json({
      message: "Failed to create product",
      error: err.message
    });
  }
}

export async function getSellerProducts(req, res) {
  const seller = req.user

  const products = await productModel.find({ seller: seller._id }).sort({ _id: -1 })

  res.status(200).json({
    message: "Products fetched successfully",
    success: true,
    products
  })
}

export async function getAllProducts(req, res) {
  const { search } = req.query
  let query = {}

  if (search) {
    query = {
      $or: [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ]
    }
  }

  const products = await productModel.find(query).sort({ _id: -1 })

  return res.status(200).json({
    message: "Products fetched succcessfully",
    success: true,
    products
  })
}

export async function getProductDetails(req, res) {
  const { id } = req.params

  const product = await productModel.findById(id)

  if (!product) {
    return res.status(404).json({
      message: "Product details not found",
      success: false,
      product
    })
  }

  return res.status(200).json({
    message: "Product details fetched successfully",
    success: true,
    product
  })

}

export async function addProductVariant(req, res) {
  try {
    const productId = req.params.productId;

    const product = await productModel.findOne({
      _id: productId,
      seller: req.user._id
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found or unauthorized",
        success: false
      });
    }

    const files = req.files || [];
    const images = [];

    if (files.length > 0) {
      const uploadResults = await Promise.all(
        files.map((file) =>
          uploadFile({
            buffer: file.buffer,
            fileName: file.originalname
          })
        )
      );
      images.push(...uploadResults);
    }

    // Extract data with fallbacks and type conversion
    const { title, description } = req.body;
    const priceAmount = Number(req.body.priceAmount || req.body.price || product.price.amount);
    const stock = Number(req.body.stock || 0);
    
    let attributes = {};
    try {
      attributes = typeof req.body.attributes === 'string' 
        ? JSON.parse(req.body.attributes) 
        : req.body.attributes;
    } catch (e) {
      console.error("Error parsing attributes:", e);
    }

    product.variants.push({
      title,
      description,
      images,

      price: {
        amount: priceAmount,
        currency: req.body.priceCurrency || product.currency || "INR"
      },
      stock,
      attributes
    });

    await product.save();

    return res.status(200).json({
      message: "Product variant added successfully",
      success: true,
      product
    });
  } catch (err) {
    console.error("Add variant error:", err);
    res.status(500).json({
      message: "Failed to add product variant",
      success: false,
      error: err.message
    });
  }
}

export async function updateProductVariant(req, res) {
  try {
    const { productId, variantId } = req.params;
    const { title, description, priceAmount, stock, attributes } = req.body;

    const product = await productModel.findOne({
      _id: productId,
      seller: req.user._id
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found or unauthorized",
        success: false
      });
    }

    const variant = product.variants.id(variantId);
    if (!variant) {
      return res.status(404).json({
        message: "Variant not found",
        success: false
      });
    }

    // Handle new images if any
    const files = req.files || [];
    if (files.length > 0) {
      const uploadResults = await Promise.all(
        files.map((file) =>
          uploadFile({
            buffer: file.buffer,
            fileName: file.originalname
          })
        )
      );
      // For now, we replace images. User can be given option to append later.
      variant.images = uploadResults;
    }

    // Update fields if provided using variant.set for better change detection
    if (title !== undefined) variant.title = title;
    if (description !== undefined) variant.description = description;
    if (stock !== undefined) variant.stock = Number(stock);
    
    if (priceAmount !== undefined) {
      variant.set('price.amount', Number(priceAmount));
    }
    
    if (attributes !== undefined) {
      try {
        const parsedAttributes = typeof attributes === 'string' 
          ? JSON.parse(attributes) 
          : attributes;
        variant.set('attributes', parsedAttributes);
      } catch (e) {
        console.error("Error parsing attributes in update:", e);
      }
    }

    // Force Mongoose to detect changes in the variants array/subdocuments
    product.markModified('variants');
    await product.save();

    res.status(200).json({
      message: "Variant updated successfully",
      success: true,
      product
    });
  } catch (err) {
    console.error("Update variant error:", err);
    res.status(500).json({
      message: "Failed to update variant",
      success: false,
      error: err.message
    });
  }
}
