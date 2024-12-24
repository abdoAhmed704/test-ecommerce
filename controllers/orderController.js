const asyncHandler = require("express-async-handler");
const Order = require("../models/orderModel");
const ApiError = require("../utils/apiError");
const Product = require("../models/productModel");
const Coupon = require("../models/couponModel");

// @desc    create an Order
// @route   POST  /api/v1/orders
// @access  protected/User
exports.createOrder = asyncHandler(async (req, res, next) => {
  const { items } = req.body;

  if (!items || items.length === 0) {
    return next(new ApiError("No items in the order", 400));
  }

  let finalPrice = 0;

 const finalItems = await Promise.all(
   items.map(async (item) => {
     const { productId, quantity, coupon: couponName } = item;
     const product = await Product.findById(productId);

     if (!product) {
       throw new Error(`Product with ID ${productId} not found.`);
     }

     let itemTotal = product.price * quantity;

		 console.log(couponName);
     if (couponName) {
       const coupon = await Coupon.findOne({ name: couponName });
       if (coupon) {
         // Apply discount
				 itemTotal *= 1 - coupon.discount / 100;
       }
     }
     finalPrice += itemTotal;

     return {
       product: productId,
       quantity,
       price: product.price,
     };
   })
 );
  const order = await Order.create({
    user: req.user._id,
    items: finalItems,
    totalPrice: finalPrice,
  });

  res.status(201).json({
    success: true,
    order,
  });
});


// @desc   	Get the orders
// @route   GET  /api/v1/orders
// @access  protected/User
exports.getAllOrders = asyncHandler(async (req, res) => {
  const order = await Order.find({ user: req.user._id });
  res.status(200).json({ orders: order });
});

// @desc   	Get an orders
// @route   GET  /api/v1/orders/:id
// @access  protected/User
exports.getOrderById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const order = await Order.find({ _id: id, user: req.user._id });
  if (!order) {
    return next(new ApiError(`there is no Order for you`, 404));
  }
  res.status(200).json({ order: order });
});

// @desc   	Delete an Order
// @route   GET  /api/v1/orders/:id
// @access  protected/User
exports.deleteOrderById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const document = await Order.findById(id);
  if (!document) {
    return next(new ApiError(`No document for this id ${id}`, 404));
  }
  if (document.user.toString() !== req.user._id.toString()) {
    return next(new ApiError(`You Are Not Allowd to delete this`, 405));
  }
  await Order.findByIdAndDelete(id);
  res.status(204).send();
});
