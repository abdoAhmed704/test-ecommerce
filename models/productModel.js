const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
      trim: true,
      minLength: [3, "Too short product title"],
      maxLength: [100, "Too long product title"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    description: {
      type: String,
      require: [true, "Product description is required"],
      minLength: [20, "Too short description"],
    },
    quantity: {
      type: Number,
      require: [true, "Product Quantity is required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      require: [true, "Product price is required"],
      trim: true,
      max: [200000, "Two long product Price"],
    },
    priceAfterDiscount: {
      type: Number,
    },
    colors: [String],
    coverImage: {
      type: String,
      require: [true, "Product image cover is required"],
    },
    images: [String],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      // required: [true, "product must be belong to category"],
    },
  },

  {
    timestamps: true,
    // to do virtual population
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.virtual("feedbacks", {
  ref: "Feedback",
  foreignField: "product",
  localField: "_id",
});

productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name -_id",
  });
  next();
});

const getURL = (doc) => {
  if (doc.coverImage) {
    const imgeURL = `${process.env.BASE_URL}/product/${doc.coverImage}`;
    doc.coverImage = imgeURL;
  }
  if (doc.images) {
    const listOfImages = [];
    doc.images.forEach((image) => {
      const imgeURL = `${process.env.BASE_URL}/product/${image}`;
      listOfImages.push(imgeURL);
    });
    doc.images = listOfImages;
  }
};

productSchema.post("save", (doc) => {
  getURL(doc);
});
productSchema.post("init", (doc) => {
  getURL(doc);
});

module.exports = mongoose.model("Product", productSchema);
