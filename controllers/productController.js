const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

// const multer = require("multer");
const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/apiError");
const Product = require("../models/productModel");
const { deleteOne, updateOne, createOne, getAll } = require("./Factory");
const {
  uploadMultipleImages,
} = require("../middleWares/imageProcessingMiddleware");

exports.uploadProductImages = uploadMultipleImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

exports.imageProcessing = asyncHandler(async (req, res, next) => {
  // 1- Processing for imageCover
  if (req.files.imageCover) {
    const imageCoverName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/product/${imageCoverName}`);
    req.body.imageCover = imageCoverName;
  }
  // 2- Processing for imges
  if (req.files.images) {
    await Promise.all(
      req.files.images.map(async (img, index) => {
        req.body.images = [];
        const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
        await sharp(img.buffer)
          .resize(600, 600)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/product/${imageName}`);
        req.body.images.push(imageName);
      })
    );
  }
  next();
});
// @desc    Get list Product
// @route   GET  /api/v1/Products
// @access  Public

exports.getProducts = getAll(Product, "Products");

// @desc    Get Product by id
// @route   GET  /api/v1/Products/:id
// @access  Publicfr4

exports.getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id).populate("reviews");
  if (!product) {
    return next(new ApiError(`There is no document for this id ${id}`, 404));
  }
  res.status(200).json({ data: product });
});

// @desc    Create Product
// @route   POST  /api/v1/Products
// @access  Private
exports.createProduct = createOne(Product);

// @desc    update Product by Id
// @route   PUT /api/v1/Product/:id
// @access  private
exports.updateProduct = updateOne(Product);

// @desc    DELETE Product by Id
// @route   DELETE /api/v1/Product/:id
// @access  private
exports.deleteProduct = deleteOne(Product);
