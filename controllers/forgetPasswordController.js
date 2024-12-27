const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const SendError = require("../utils/sendError");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true, // true for port 465, false for other ports
    auth: {
      user: process.env.EMAIL_AUTH_USER,
      pass: process.env.EMAIL_AUTH_PASS,
    },
  });
  await transporter.sendMail({
    from: '"Ecommify" <abdoahmedsayed704@gmail.com>', // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    html: options.html, // plain text body
  });
};

const generateToken = (payload) =>
  jwt.sign({ userId: payload }, process.env.JWT_SECRET_KET, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });

exports.forgetPassword = asyncHandler(async (req, res, next) => {
  // 1) get the user email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new SendError("User Not found!. please try again", 404));
  }
  // Generate hashed reset code 5 digit
  const code = Math.floor(10000 + Math.random() * 90000).toString();
  const hashedCode = crypto.createHash("sha256").update(code).digest("hex");

  //save the hashed code in the database
  user.ResetPasswordCode = hashedCode;
  user.ResetPasswordCodeExpire = Date.now() + 10 * 60 * 1000; // Will expire after 10 mins
  user.ResetPasswordCodeIsValid = false;
  await user.save();

  //send Email
  const message = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2 style="color: #4CAF50;">Hello ${user.name},</h2>
    <p>You requested a password reset for your <strong>Ecommify</strong> account.</p>
    <p style="font-size: 18px; font-weight: bold;">Your reset code is:</p>
    <p style="font-size: 24px; color: #4CAF50; font-weight: bold;">${code}</p>
    <p><em>Note: This code is valid for 10 minutes.</em></p>
    <p>If you didn’t request this, please ignore this email or contact our support team for assistance.</p>
    <p style="margin-top: 20px;">Best regards,</p>
    <p>The <strong>Ecommify</strong> Team</p>
  </div>
`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Reset Password Code (Valid After 10 Min)",
      html: message,
    });
  } catch (error) {
    user.ResetPasswordCode = undefined;
    user.ResetPasswordCodeExpire = undefined;
    user.ResetPasswordCodeIsValid = undefined;
    await user.save();
    return next(new SendError("Failed to send the email"));
  }

  res
    .status(200)
    .json({ status: "success", message: "Reset code sent to the Email" });
});

exports.verfiyResetCode = asyncHandler(async (req, res, next) => {
  const hashedCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");
  const user = await User.findOne({
    ResetPasswordCode: hashedCode,
    ResetPasswordCodeExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(new SendError("Code inValid or Expired", 500));
  }
  user.ResetPasswordCodeIsValid = true;
  await user.save();
  res.status(200).json({ status: "Success" });
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  // check if there is a user
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new SendError("User Not Found!!", 404));
  }
  // check if the code is valid
  if (!user.ResetPasswordCodeIsValid) {
    return next(new SendError("reset code is not valid !!", 404));
  }
  user.password = req.body.newPassword;

  user.ResetPasswordCode = undefined;
  user.ResetPasswordCodeExpire = undefined;
  user.ResetPasswordCodeIsValid = undefined;

  await user.save();

  const token = generateToken(user._id);
  res.status(200).json({ status: "Success", token });
});
