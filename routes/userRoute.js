const express = require("express");

const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  updatePasswordValidator,
  updateMyDataValidator,
} = require("../utils/validations/userValidation");

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

router.get("/getMe", auth.secure, getMe, getUser);
router.put("/changeMyPassword", auth.secure, changeMyPassword);
router.put(
  "/updateMyData",
  auth.secure,
  uploadUserImage,
  imageProcessing,
  updateMyData
);

// For Admin
router.use(auth.secure, auth.allowedRoles("admin"));

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
