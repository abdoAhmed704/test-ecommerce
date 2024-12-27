const express = require("express");

const {
  getCouponById,
  getCoupons,
  createCoupon,
  updateCouponById,
  deleteCouponById,
} = require("../controllers/couponController");

const auth = require("../controllers/authController");

const router = express.Router();

router.use(auth.secure, auth.allowedRoles("admin"));

router.route("/").get(getCoupons).post(createCoupon);
router
  .route("/:id")
  .get(getCouponById)
  .put(updateCouponById)
  .delete(deleteCouponById);

module.exports = router;
