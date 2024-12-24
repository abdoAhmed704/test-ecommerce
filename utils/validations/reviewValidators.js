const { check } = require("express-validator");
const Review = require("../../models/reviewModel");
const validatorMiddleware = require("../../middleWares/validationMiddleware");

exports.createReviewValidators = [
  check("title").optional(),
  check("rates")
    .notEmpty()
    .withMessage("ratings required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Ratings must be from 1 to 5"),
  check("user").isMongoId().withMessage("Wrong Review id format"),
  check("product")
    .isMongoId()
    .withMessage("Wrong Review id format")
    .custom((val, { req }) =>
      // Check if logged user create review before
      Review.findOne({ product: req.body.product, user: req.user._id }).then(
        (review) => {
          console.log(review);
          if (review) {
            return Promise.reject(new Error("You only can create one review"));
          }
        }
      )
    ),
  validatorMiddleware,
];

exports.getReviewValidators = [
  check("id").isMongoId().withMessage("Wrong Review id format"),
  validatorMiddleware,
];

exports.updateReviewValidators = [
  check("id")
    .isMongoId()
    .withMessage("Wrong Review id format")
    .custom((val, { req }) =>
      // Check review ownership before update
      Review.findById(val).then((review) => {
        if (!review) {
          return Promise.reject(new Error(`There is no review For id ${val}`));
        }

        if (req.user._id.toString() !== review.user._id.toString()) {
          return Promise.reject(
            new Error(`You are not allowed to Edit that review`)
          );
        }
      })
    ),
  validatorMiddleware,
];

exports.deleteReviewValidators = [
  check("id")
    .isMongoId()
    .withMessage("Wrong Review id format")
    .custom((val, { req }) => {
      // Check review ownership before update
      if (req.user.role === "user") {
        return Review.findById(val).then((review) => {
          if (!review) {
            return Promise.reject(
              new Error(`There is no review For that id: ${val}`)
            );
          }
          if (review.user._id.toString() !== req.user._id.toString()) {
            return Promise.reject(
              new Error("You are not allowed to delete that review")
            );
          }
        });
      }
      return true;
    }),
  validatorMiddleware,
];
