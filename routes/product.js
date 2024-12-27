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
} = require("../utils/validations/productValidation");

const auth = require("../controllers/authController");
const feedbackRouter = require("./feedback");

// Nasted Route
// products/<_id for product>/feedback
router.use("/:productId/feedbacks", feedbackRouter);

router
  .route("/")
  .get(getProducts)
  .post(
    auth.secure,
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
    auth.secure,
    auth.allowedRoles("admin"),
    uploadProductImages,
    imageProcessing,
    updateProductValidator,
    updateProduct
  )
  .delete(
    auth.secure,
    auth.allowedRoles("admin"),
    deleteProductValidator,
    deleteProduct
  );

module.exports = router;
