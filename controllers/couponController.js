const Coupon = require("../models/couponModel");

const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./Factory");

// @desc    Get coupons
// @route   GET /api/v1/coupons
// @access  Private/Admin
exports.getCoupons = getAll(Coupon);

// @desc    Get coupon
// @route   GET /api/v1/coupons/:id
// @access  Private/Admin
exports.getCoupon = getOne(Coupon);

// @desc    Create a coupon
// @route   POST  /api/v1/coupons
// @access  Private/Admin
exports.createCoupon = createOne(Coupon);

// @desc    Update a coupon
// @route   PUT /api/v1/coupons/:id
// @access  Private/Admin
exports.updateCoupon = updateOne(Coupon);

// @desc    Delete a coupon
// @route   DELETE /api/v1/coupons/:id
// @access  Private/Admin
exports.deleteCoupon = deleteOne(Coupon);
