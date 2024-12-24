const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const sharp = require("sharp");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const User = require("../models/userModel");
const ApiError = require("../utils/apiError");

const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./Factory");

const {
  uploadSingleImage,
} = require("../middleWares/imageProcessingMiddleware");

const generateToken = (payload) =>
  jwt.sign({ userId: payload }, process.env.JWT_SECRET_KET, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });

// const ApiError = require("../utils/apiError");

exports.uploadUserImage = uploadSingleImage("profileImage");

exports.imageProcessing = asyncHandler(async (req, res, next) => {
  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 99 })
      .toFile(`uploads/users/${filename}`);
    console.log("@@@ in req.file");
    req.body.profileImage = filename;
  }

  next();
});

// @desc    Get list of User
// @route   GET  /api/v1/users
// @access  private

exports.getUsers = getAll(User, "Users");

// @desc    Get User by id
// @route   GET  /api/v1/users/:id
// @access  private

exports.getUser = getOne(User);

// @desc    Create User
// @route   POST  /api/v1/users
// @access  Private
exports.createUser = createOne(User);

// @desc    update User by Id
// @route   PUT /api/v1/User/:id
// @access  private
exports.updateUser = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      phone: req.body.phone,
      email: req.body.email,
      role: req.body.role,
      profileImage: req.body.profileImage,
    },
    {
      new: true,
    }
  );

  if (!user) {
    return next(new ApiError(`No user for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: user });
});

exports.updatePassword = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
  if (!user) {
    return next(new ApiError(`No user for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ massage: "Password Updated", data: user.password });
});

// @desc    DELETE User by Id
// @route   DELETE /api/v1/User/:id
// @access  private
exports.deleteUser = deleteOne(User);

// @desc    get my data
// @route   PUT /api/v1/users/getMe
// @access  Private/Protect
exports.getMe = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// @desc    Update my password
// @route   PUT /api/v1/users/changeMyPassword
// @access  Private/Protect
exports.changeMyPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
  const token = generateToken(user._id);
  res.status(200).json({ massage: "Password Updated", data: user, token });
});

// @desc    Update logged user data (without password)
// @route   PUT /api/v1/users/updateMyData
// @access  Private/Protect
exports.updateMyData = asyncHandler(async (req, res, next) => {
  const data = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    { new: true }
  );

  res.status(200).json({ data: data });
});
