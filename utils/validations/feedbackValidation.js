const { check } = require("express-validator");
const Feedback = require("../../models/feedbackModel");
const validatorMiddleware = require("./validationMiddleware");

exports.createFeedbackValidators = [
  check("title").optional(),
  check("rates")
    .notEmpty()
    .withMessage("ratings required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Ratings must be from 1 to 5"),
  check("user").isMongoId().withMessage("Wrong Feedback id format"),
  check("product")
    .isMongoId()
    .withMessage("Wrong Feedback id format")
    .custom((val, { req }) =>
      // Check if logged user create Feedback before
      Feedback.findOne({ product: req.body.product, user: req.user._id }).then(
        (feedback) => {
          console.log(feedback);
          if (feedback) {
            return Promise.reject(
              new Error("You only can create one Feedback")
            );
          }
        }
      )
    ),
  validatorMiddleware,
];

exports.getFeedbackValidators = [
  check("id").isMongoId().withMessage("Wrong Feedback id format"),
  validatorMiddleware,
];

exports.updateFeedbackValidators = [
  check("id")
    .isMongoId()
    .withMessage("Wrong Feedback id format")
    .custom((val, { req }) =>
      // Check Feedback ownership before update
      Feedback.findById(val).then((feedback) => {
        if (!feedback) {
          return Promise.reject(
            new Error(`There is no Feedback For id ${val}`)
          );
        }

        if (req.user._id.toString() !== feedback.user._id.toString()) {
          return Promise.reject(
            new Error(`You are not allowed to Edit that Feedback`)
          );
        }
      })
    ),
  validatorMiddleware,
];

exports.deleteFeedbackValidators = [
  check("id")
    .isMongoId()
    .withMessage("Wrong Feedback id format")
    .custom((val, { req }) => {
      // Check Feedback ownership before update
      if (req.user.role === "user") {
        return Feedback.findById(val).then((feedback) => {
          if (!feedback) {
            return Promise.reject(
              new Error(`There is no Feedback For that id: ${val}`)
            );
          }
          if (feedback.user._id.toString() !== req.user._id.toString()) {
            return Promise.reject(
              new Error("You are not allowed to delete that Feedback")
            );
          }
        });
      }
      return true;
    }),
  validatorMiddleware,
];
