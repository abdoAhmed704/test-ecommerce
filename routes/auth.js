const express = require("express");

const {
  signupValidator,
  loginValidator,
} = require("../utils/validations/authValidators");

const { signup, login } = require("../controllers/authController");
const {
  forgetPassword,
  verfiyResetCode,
  resetPassword,
} = require("../controllers/forgetPasswordController");

const router = express.Router();

router.route("/signup").post(signupValidator, signup);
router.route("/login").post(loginValidator, login);

// Forget password Routes

router.route("/forgetPassword").post(forgetPassword);
router.route("/verfiyResetCode").post(verfiyResetCode);
router.route("/resetPassword").post(resetPassword);

module.exports = router;
