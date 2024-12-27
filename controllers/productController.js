const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

// const multer = require("multer");
const asyncHandler = require("express-async-handler");

const SendError = require("../utils/sendError");
const Product = require("../models/productModel");
const {
  deleteOneByIdOf,
  updateOneById,
  createOneOf,
  getAllOf,
} = require("./Factory");

const {
  uploadManyImages,
} = require("../middleWares/imageProcessingMiddleware");

exports.uploadProductImages = uploadManyImages([
  { name: "coverImage", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

exports.imageProcessing = asyncHandler(async (req, res, next) => {
  if (req.files.coverImage) {
    const coverImageName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.coverImage[0].buffer)
      .resize(500, 700)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`public/uploads/product/${coverImageName}`);
    req.body.coverImage = coverImageName;
  }
  if (req.files.images) {
    await Promise.all(
      req.files.images.map(async (img, index) => {
        req.body.images = [];
        const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
        await sharp(img.buffer)
          .resize(600, 600)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`public/uploads/product/${imageName}`);
        req.body.images.push(imageName);
      })
    );
  }
  next();
});

// @desc    Get list of Products
// @route   GET  /api/v1/Products
// @access  Public
exports.getProducts = getAllOf(Product, "Products");

// @desc    Get Product by id
// @route   GET  /api/v1/Products/:id
// @access  Publicfr4
exports.getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id).populate("feedback");
  if (!product) {
    return next(new SendError(`There is no document for this id ${id}`, 404));
  }
  res.status(200).json({ data: product });
});

// @desc    Create Product
// @route   POST  /api/v1/Products
// @access  Private
exports.createProduct = createOneOf(Product);

// @desc    update Product by Id
// @route   PUT /api/v1/Product/:id
// @access  private
exports.updateProduct = updateOneById(Product);

// @desc    DELETE Product by Id
// @route   DELETE /api/v1/Product/:id
// @access  private
exports.deleteProduct = deleteOneByIdOf(Product);
