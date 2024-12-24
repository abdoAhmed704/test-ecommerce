const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");

const Category = require("../models/categoryModel");

const {
  uploadSingleImage,
} = require("../middleWares/imageProcessingMiddleware");

const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./Factory");
// const ApiError = require("../utils/apiError");

exports.uploadCategoryImage = uploadSingleImage("image");

exports.imageProcessing = asyncHandler(async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 99 })
      .toFile(`uploads/category/${filename}`);
    req.body.image = filename;
  }
  next();
});

// @desc    Get list category
// @route   GET  /api/v1/categories
// @access  Public
exports.getCategories = getAll(Category, "categories");

// @desc    Get category by id
// @route   GET  /api/v1/categories/:id
// @access  Public
exports.getCategory = getOne(Category);

// @desc    Create category
// @route   POST  /api/v1/categories
// @access  Private
exports.createCategory = createOne(Category);

// @desc    update Category by Id
// @route   PUT /api/v1/category/:id
// @access  private
exports.updateCategory = updateOne(Category);

// @desc    DELETE Category by Id
// @route   DELETE /api/v1/category/:id
// @access  private
exports.deleteCategory = deleteOne(Category);
