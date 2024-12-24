const express = require("express");
const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/validations/brandValidators");
const {
  createBrand,
  getBrands,
  getBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  imageProcessing,
} = require("../controllers/brandController");

const auth = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .post(
    auth.protect,
    auth.allowedRoles("admin"),
    uploadBrandImage,
    imageProcessing,
    createBrandValidator,
    createBrand
  )
  .get(getBrands);
router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(
    auth.protect,
    auth.allowedRoles("admin"),
    uploadBrandImage,
    imageProcessing,
    updateBrandValidator,
    updateBrand
  )
  .delete(
    auth.protect,
    auth.allowedRoles("admin"),
    deleteBrandValidator,
    deleteBrand
  );
module.exports = router;
