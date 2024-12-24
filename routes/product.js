const express = require("express");

const router = express.Router();

const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  imageProcessing,
} = require("../controllers/productController");
const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validations/productValidators");

const auth = require("../controllers/authController");
const reviewRouter = require("./review");

// Nasted Route
// products/<_id for product>/reviews
router.use("/:productId/reviews", reviewRouter);

router
  .route("/")
  .get(getProducts)
  .post(
    auth.protect,
    auth.allowedRoles("admin"),
    uploadProductImages,
    imageProcessing,
    createProductValidator,
    createProduct
  );
router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(
    auth.protect,
    auth.allowedRoles("admin"),
    uploadProductImages,
    imageProcessing,
    updateProductValidator,
    updateProduct
  )
  .delete(
    auth.protect,
    auth.allowedRoles("admin"),
    deleteProductValidator,
    deleteProduct
  );

module.exports = router;
