const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "name is required"],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      require: [true, "email is required"],
      unique: [true, "email must be unique"],
    },
    phone: String,
    profileImage: String,
    password: {
      type: String,
      require: [true, "password required"],
      unique: true,
      minlength: [4, "Password is too small"],
    },
    passwordChangedAt: Date,
    ResetPasswordCode: String,
    ResetPasswordCodeExpire: Date,
    ResetPasswordCodeIsValid: Boolean,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    favourite: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);

  next();
});

const setURLImage = (doc) => {
  if (doc.profileImage) {
    const imageURL = `${process.env.BASE_URL}/users/${doc.profileImage}`;
    doc.profileImage = imageURL;
  }
};

userSchema.post("init", (doc) => {
  setURLImage(doc);
});

userSchema.post("save", (doc) => {
  setURLImage(doc);
});

const User = mongoose.model("User", userSchema);

module.exports = User;
