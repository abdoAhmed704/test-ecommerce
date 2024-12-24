const { check } = require("express-validator");
const slugify = require("slugify");
const bcrypt = require("bcryptjs");
const validatorMiddleware = require("../../middleWares/validationMiddleware");
const User = require("../../models/userModel");

exports.getUserValidator = [
  check("id").isMongoId().withMessage("invalid User id format"),
  validatorMiddleware,
];

exports.createUserValidator = [
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

  check("phone")
    .optional()
    .isMobilePhone("any")
    .withMessage("invalid phone number"),

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

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
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

  check("phone")
    .optional()
    .isMobilePhone("any")
    .withMessage("invalid phone number"),

  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail already in user"));
        }
      })
    ),
  validatorMiddleware,
];

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  validatorMiddleware,
];

exports.updatePasswordValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),

  check("currentPassword").notEmpty().withMessage("Current password required"),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirmation required"),
  check("password")
    .notEmpty()
    .withMessage("Must fill the new password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .custom(async (val, { req }) => {
      // is the current password exsists?
      const user = await User.findById(req.params.id);
      if (!user) {
        throw new Error(`User not found by this id: ${req.params.id}`);
      }
      const match = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!match) {
        throw new Error("Wrong current password");
      }
      // is the confirm password = the new password
      if (val !== req.body.passwordConfirm) {
        throw new Error("Wrong password confirm");
      }
      return true;
    }),
  validatorMiddleware,
];

exports.updateMyDataValidator = [
  check("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),

  check("phone")
    .optional()
    .isMobilePhone("any")
    .withMessage("invalid phone number"),

  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail already in user"));
        }
      })
    ),
  validatorMiddleware,
];
