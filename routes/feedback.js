const express = require("express");

const {
  getFeedbacks,
  getFeedbackById,
  createFeedback,
  updateFeedbackById,
  deleteFeedbackById,
  createFilterObject,
  seProductIdToBody,
} = require("../controllers/feedbackController");
const {
  createFeedbackValidators,
  getFeedbackValidators,
  updateFeedbackValidators,
  deleteFeedbackValidators,
} = require("../utils/validations/feedbackValidation");
const auth = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    auth.secure,
    auth.allowedRoles("user"),
    seProductIdToBody,
    createFeedbackValidators,
    createFeedback
  )
  .get(createFilterObject, getFeedbacks);

router
  .route("/:id")
  .get(getFeedbackValidators, getFeedbackById)
  .put(
    auth.secure,
    auth.allowedRoles("user"),
    updateFeedbackValidators,
    updateFeedbackById
  )
  .delete(
    auth.secure,
    auth.allowedRoles("user", "admin"),
    deleteFeedbackValidators,
    deleteFeedbackById
  );
module.exports = router;
