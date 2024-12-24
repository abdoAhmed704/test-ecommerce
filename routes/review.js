const express = require("express");

const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  createFilterObject,
  seProductIdToBody,
} = require("../controllers/reviewController");
const {
  createReviewValidators,
  getReviewValidators,
  updateReviewValidators,
  deleteReviewValidators,
} = require("../utils/validations/reviewValidators");
const auth = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    auth.protect,
    auth.allowedRoles("user"),
    seProductIdToBody,
    createReviewValidators,
    createReview
  )
  .get(createFilterObject, getReviews);

router
  .route("/:id")
  .get(getReviewValidators, getReview)
  .put(
    auth.protect,
    auth.allowedRoles("user"),
    updateReviewValidators,
    updateReview
  )
  .delete(
    auth.protect,
    auth.allowedRoles("user", "admin"),
    deleteReviewValidators,
    deleteReview
  );
module.exports = router;
