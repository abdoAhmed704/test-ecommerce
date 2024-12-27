const express = require("express");
const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validations/categoryValidation");

const auth = require("../controllers/authController");

const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategoryById,
  deleteCategoryById,
  uploadCategoryImage,
  imageProcessing,
} = require("../controllers/categoryController");

const router = express.Router();

router
  .route("/")
  .get(getCategories)
  .post(
    auth.secure,
    auth.allowedRoles("admin"),
    uploadCategoryImage,
    imageProcessing,
    createCategoryValidator,
    createCategory
  );
router
  .route("/:id")
  .get(getCategoryValidator, getCategoryById)
  .put(
    auth.secure,
    auth.allowedRoles("admin"),
    uploadCategoryImage,
    imageProcessing,
    updateCategoryValidator,
    updateCategoryById
  )
  .delete(
    auth.secure,
    auth.allowedRoles("admin"),
    deleteCategoryValidator,
    deleteCategoryById
  );

module.exports = router;
