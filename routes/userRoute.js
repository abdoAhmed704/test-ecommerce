const express = require("express");

const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  updatePasswordValidator,
  updateMyDataValidator,
} = require("../utils/validations/userValidators");

const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  imageProcessing,
  updatePassword,
  getMe,
  changeMyPassword,
  updateMyData,
} = require("../controllers/userController");

const auth = require("../controllers/authController");

const router = express.Router();

router.get("/getMe", auth.protect, getMe, getUser);
router.put("/changeMyPassword", auth.protect, changeMyPassword);
router.put("/updateMyData", auth.protect, updateMyDataValidator, updateMyData);

// For Admin
router.use(auth.protect, auth.allowedRoles("admin"));

router
  .route("/")
  .post(uploadUserImage, imageProcessing, createUserValidator, createUser)
  .get(getUsers);
router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(uploadUserImage, imageProcessing, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

router
  .route("/updatePassword/:id")
  .put(updatePasswordValidator, updatePassword);

module.exports = router;
