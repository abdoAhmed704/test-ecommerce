const express = require("express");
const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validations/categoryValidators");

const auth = require("../controllers/authController");

const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  imageProcessing,
} = require("../controllers/categoryController");

const subcategoriesRoute = require("./subCategory");

const router = express.Router();

router.use("/:categoryId/subcategories", subcategoriesRoute);

router
  .route("/")
  .get(getCategories)
  .post(
    auth.protect,
    auth.allowedRoles("admin"),
    uploadCategoryImage,
    imageProcessing,
    createCategoryValidator,
    createCategory
  );
router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(
    auth.protect,
    auth.allowedRoles("admin"),
    uploadCategoryImage,
    imageProcessing,
    updateCategoryValidator,
    updateCategory
  )
  .delete(
    auth.protect,
    auth.allowedRoles("admin"),
    deleteCategoryValidator,
    deleteCategory
  );

module.exports = router;
