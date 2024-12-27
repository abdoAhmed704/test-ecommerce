const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const Brand = require("../models/brandModel");
const {
  deleteOneByIdOf,
  updateOneById,
  createOneOf,
  getOneByIdOf,
  getAllOf,
} = require("./Factory");

const { uploadOneImage } = require("../middleWares/imageProcessingMiddleware");

exports.uploadBrandImage = uploadOneImage("image");

exports.imageProcessing = asyncHandler(async (req, res, next) => {
  const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 99 })
      .toFile(`public/uploads/brand/${filename}`);
    req.body.image = filename;
  }
  next();
});

// @desc    Get list Brand
// @route   GET  /api/v1/Brands
// @access  Public

exports.getBrands = getAllOf(Brand, "Brands");

// @desc    Get Brand by id
// @route   GET  /api/v1/Brands/:id
// @access  Public

exports.getBrandById = getOneByIdOf(Brand);

// @desc    Create Brand
// @route   POST  /api/v1/Brands
// @access  Private
exports.createBrand = createOneOf(Brand);

// @desc    update Brand by Id
// @route   PUT /api/v1/Brand/:id
// @access  private
exports.updateBrandById = updateOneById(Brand);

// @desc    DELETE Brand by Id
// @route   DELETE /api/v1/Brand/:id
// @access  private
exports.deleteBrandById = deleteOneByIdOf(Brand);
