const asyncHandler = require("express-async-handler");
const Review = require("../models/reviewModel");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./Factory");

// const ApiError = require("../utils/apiError");

exports.seProductIdToBody = (req, res, next) => {
  // Nested route (Create)
  if (!req.body.product) {
    req.body.product = req.params.productId;
  }
  if (!req.body.user) {
    req.body.user = req.user._id;
  }
  next();
};

// Nested route
// GET /api/v1/products/:productId/reviews
exports.createFilterObject = (req, res, next) => {
  let filterObj = {};
  if (req.params.productId) {
    filterObj = { product: req.params.productId };
  }
  req.filtration = filterObj;
  next();
};

// @desc    Get list Reviews
// @route   GET  /api/v1/Reviews
// @access  Public

exports.getReviews = getAll(Review, "Review");

// @desc    Get Review by id
// @route   GET  /api/v1/Reviews/:id
// @access  Public
exports.getReview = getOne(Review);

// @desc    Create Review
// @route   POST  /api/v1/Reviews
// @access  Private/protected/user
exports.createReview = createOne(Review);

// @desc    update Review
// @route   PUT  /api/v1/Reviews/:id
// @access  Private/protected/user
exports.updateReview = updateOne(Review);

// @desc    DELETE Reviews by Id
// @route   DELETE /api/v1/Reviews/:id
// @access  private
exports.deleteReview = deleteOne(Review);
