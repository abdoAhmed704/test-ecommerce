const express = require("express");

const {
  signupValidator,
  loginValidator,
} = require("../utils/validations/authValidation");

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

router.route("/fpw").post(forgetPassword);
router.route("/vrc").post(verfiyResetCode);
router.route("/rpw").post(resetPassword);

module.exports = router;
