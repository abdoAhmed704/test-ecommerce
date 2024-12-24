const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    rates: {
      type: Number,
      min: [1, "Min rate value is (1)"],
      max: [5, "Max rate value is (5)"],
      required: [true, "review ratings required"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "The Review must belong to a User"],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "The Review must belong to a Product"],
    },
  },
  { timestamps: true }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name profileImage" });
  next();
});


module.exports = mongoose.model('Review', reviewSchema);