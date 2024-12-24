const express = require("express");

const auth = require("../controllers/authController");

const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getOrderById,
  deleteOrderById,
} = require("../controllers/orderController");

// Routes
router.post("/", auth.protect, auth.allowedRoles("user"), createOrder); // Create an order
router.get("/", auth.protect, auth.allowedRoles("user"), getAllOrders); // Admin: Get all orders
router.get("/:id", auth.protect, auth.allowedRoles("user"), getOrderById); // Get single order by ID
router.delete("/:id", auth.protect, auth.allowedRoles("user"), deleteOrderById);
module.exports = router;
