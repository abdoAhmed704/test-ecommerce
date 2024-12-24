const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const Brand = require("../models/brandModel");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./Factory");

const {
  uploadSingleImage,
} = require("../middleWares/imageProcessingMiddleware");

// const ApiError = require("../utils/apiError");

exports.uploadBrandImage = uploadSingleImage("image");

exports.imageProcessing = asyncHandler(async (req, res, next) => {
  const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 99 })
      .toFile(`uploads/brand/${filename}`);
    req.body.image = filename;
  }
  next();
});

// @desc    Get list Brand
// @route   GET  /api/v1/Brands
// @access  Public

exports.getBrands = getAll(Brand, "Brands");

// @desc    Get Brand by id
// @route   GET  /api/v1/Brands/:id
// @access  Public

exports.getBrand = getOne(Brand);

// @desc    Create Brand
// @route   POST  /api/v1/Brands
// @access  Private
exports.createBrand = createOne(Brand);

// @desc    update Brand by Id
// @route   PUT /api/v1/Brand/:id
// @access  private
exports.updateBrand = updateOne(Brand);

// @desc    DELETE Brand by Id
// @route   DELETE /api/v1/Brand/:id
// @access  private
exports.deleteBrand = deleteOne(Brand);
