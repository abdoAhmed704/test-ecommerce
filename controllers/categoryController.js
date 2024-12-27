const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");

const Category = require("../models/categoryModel");

const { uploadOneImage } = require("../middleWares/imageProcessingMiddleware");

const {
  deleteOneByIdOf,
  updateOneById,
  createOneOf,
  getOneByIdOf,
  getAllOf,
} = require("./Factory");

exports.uploadCategoryImage = uploadOneImage("image");

exports.imageProcessing = asyncHandler(async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 99 })
      .toFile(`public/uploads/category/${filename}`);
    req.body.image = filename;
  }
  next();
});

// @desc    Get list category
// @route   GET  /api/v1/categories
// @access  Public
exports.getCategories = getAllOf(Category, "categories");

// @desc    Get category by id
// @route   GET  /api/v1/categories/:id
// @access  Public
exports.getCategoryById = getOneByIdOf(Category);

// @desc    Create category
// @route   POST  /api/v1/categories
// @access  Private
exports.createCategory = createOneOf(Category);

// @desc    update Category by Id
// @route   PUT /api/v1/category/:id
// @access  private
exports.updateCategoryById = updateOneById(Category);

// @desc    DELETE Category by Id
// @route   DELETE /api/v1/category/:id
// @access  private
exports.deleteCategoryById = deleteOneByIdOf(Category);
