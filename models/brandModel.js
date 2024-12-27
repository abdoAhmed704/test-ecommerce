const mongoose = require("mongoose");

//1-Create schema
const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand required"],
      unique: [true, "Brand must be unique"],
      minlength: [3, "Too short Brand name"],
      maxlength: [32, "Too long Brand name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const getURL = (doc) => {
  if (doc.image) {
    const imgeURL = `${process.env.BASE_URL}/brand/${doc.image}`;
    doc.image = imgeURL;
  }
};

brandSchema.post("save", (doc) => {
  getURL(doc);
});
brandSchema.post("init", (doc) => {
  getURL(doc);
});

//2-Create model
const BrandModel = new mongoose.model("Brand", brandSchema);

module.exports = BrandModel;
