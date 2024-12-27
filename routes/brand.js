const express = require("express");
const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/validations/brandValidation");
const {
  createBrand,
  getBrands,
  getBrandById,
  updateBrandById,
  deleteBrandById,
  uploadBrandImage,
  imageProcessing,
} = require("../controllers/brandController");

const auth = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .post(
    auth.secure,
    auth.allowedRoles("admin"),
    uploadBrandImage,
    imageProcessing,
    createBrandValidator,
    createBrand
  )
  .get(getBrands);
router
  .route("/:id")
  .get(getBrandValidator, getBrandById)
  .put(
    auth.secure,
    auth.allowedRoles("admin"),
    uploadBrandImage,
    imageProcessing,
    updateBrandValidator,
    updateBrandById
  )
  .delete(
    auth.secure,
    auth.allowedRoles("admin"),
    deleteBrandValidator,
    deleteBrandById
  );
module.exports = router;
