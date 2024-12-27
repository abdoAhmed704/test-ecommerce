const { check } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("./validationMiddleware");
const User = require("../../models/userModel");

// mfkr3f rfj3rn
exports.signupValidator = [
  check("name")
    .notEmpty()
    .withMessage("User required")
    .isLength({ min: 3 })
    .withMessage("Too short User name")
    .isLength({ max: 32 })
    .withMessage("Too long User name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("email required")
    .isEmail()
    .withMessage("this is not an email")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("email has been exist"));
        }
      })
    ),
  check("password")
    .notEmpty()
    .withMessage("password required !!")
    .isLength({ min: 6 })
    .custom((password, { req }) => {
      if (password === !req.body.passwordConfirm) {
        throw new Error("Password confirm not matched !!");
      }
      return true;
    }),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirmation required!!!"),
  check("role").optional(),
  validatorMiddleware,
];

exports.loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("email required")
    .isEmail()
    .withMessage("this is not an email"),
  check("password")
    .notEmpty()
    .withMessage("password required !!")
    .isLength({ min: 6 }),
  validatorMiddleware,
];
