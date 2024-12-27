const Coupon = require("../models/couponModel");
const {
  deleteOneByIdOf,
  updateOneById,
  createOneOf,
  getOneByIdOf,
  getAllOf,
} = require("./Factory");

// @desc    Get coupons
// @route   GET /api/v1/coupons
// @access  Private/Admin
exports.getCoupons = getAllOf(Coupon);

// @desc    Get coupon
// @route   GET /api/v1/coupons/:id
// @access  Private/Admin
exports.getCouponById = getOneByIdOf(Coupon);

// @desc    Create a coupon
// @route   POST  /api/v1/coupons
// @access  Private/Admin
exports.createCoupon = createOneOf(Coupon);

// @desc    Update a coupon
// @route   PUT /api/v1/coupons/:id
// @access  Private/Admin
exports.updateCouponById = updateOneById(Coupon);

// @desc    Delete a coupon
// @route   DELETE /api/v1/coupons/:id
// @access  Private/Admin
exports.deleteCouponById = deleteOneByIdOf(Coupon);
