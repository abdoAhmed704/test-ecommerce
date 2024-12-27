const Feedback = require("../models/feedbackModel");
const {
  deleteOneByIdOf,
  updateOneById,
  createOneOf,
  getOneByIdOf,
  getAllOf,
} = require("./Factory");

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
// GET /api/v1/products/:productId/feedback
exports.createFilterObject = (req, res, next) => {
  let filterObj = {};
  if (req.params.productId) {
    filterObj = { product: req.params.productId };
  }
  req.filtration = filterObj;
  next();
};

// @desc    Get list feedback
// @route   GET  /api/v1/feedback
// @access  Public

exports.getFeedbacks = getAllOf(Feedback, "Feedback");

// @desc    Get Feedback by id
// @route   GET  /api/v1/feedbacks/:id
// @access  Public
exports.getFeedbackById = getOneByIdOf(Feedback);

// @desc    Create feedback
// @route   POST  /api/v1/feedbacks
// @access  Private/protected/user
exports.createFeedback = createOneOf(Feedback);

// @desc    update feedback
// @route   PUT  /api/v1/feedbacks/:id
// @access  Private/protected/user
exports.updateFeedbackById = updateOneById(Feedback);

// @desc    DELETE feedbacks by Id
// @route   DELETE /api/v1/feedbacks/:id
// @access  private
exports.deleteFeedbackById = deleteOneByIdOf(Feedback);
