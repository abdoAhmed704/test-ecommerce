const SubCategory = require("../models/subCategoryModel");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./Factory");

exports.setCategoryIdToBody = (req, res, next) => {
  // Nested route (Create)
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

// Nested route
// GET /api/v1/categories/:categoryId/subcategories
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filtration = filterObject;
  next();
};

// @desc    get all subCategories
// @route   GET  /api/v1/subcategories
// @access  public
exports.getSubCategories = getAll(SubCategory, "subCategories");

// @desc    Create subCategory
// @route   POST  /api/v1/subcategories
// @access  Private
exports.createSubCategory = createOne(SubCategory);

// @desc    get specsfic subCategory
// @route   GET  /api/v1/subcategories
// @access  public
exports.getSubCategory = getOne(SubCategory);

// @desc    Delete  subCategory
// @route   DELETE  /api/v1/subcategories
// @access  private
exports.deleteSubCategory = deleteOne(SubCategory);

// @desc    get specsfic subCategory
// @route   GET  /api/v1/subcategories
// @access  public
exports.updateSubCategory = updateOne(SubCategory);
