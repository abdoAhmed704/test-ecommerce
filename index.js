const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

const mongoose = require("mongoose");

const categoryRouter = require("./routes/category");
const brandRouter = require("./routes/brand");
const productRouter = require("./routes/product");
const userRouter = require("./routes/userRoute");
const authRouter = require("./routes/auth");
const feedbackRouter = require("./routes/feedback");
const orderRouter = require("./routes/order");
const couponRouter = require("./routes/coupon");

const SendError = require("./utils/sendError");
const errorHandling = require("./middleWares/errorHandleMiddleware");

dotenv.config({ path: "config.env" });

//Database connection
mongoose.set("strictQuery", false);
mongoose.connect(process.env.DB_URI).then((conn) => {
  console.log(`Database connected => ${conn.connection.host}`);
});

// app express
const app = express();

//-- middlewares
app.use(express.json());

app.use(express.static(path.join(__dirname, "public/uploads")));

if (process.env.NODE_ENV === "dev") {
  app.use(morgan("dev"));
  console.log(`process.env.NODE_ENV = ${process.env.NODE_ENV}`);
}

//1-Routes

const routes = [
  { Path: "/categories", router: categoryRouter },
  { Path: "/brands", router: brandRouter },
  { Path: "/products", router: productRouter },
  { Path: "/users", router: userRouter },
  { Path: "/auth", router: authRouter },
  { Path: "/feedback", router: feedbackRouter },
  { Path: "/coupons", router: couponRouter },
  { Path: "/orders", router: orderRouter },
];

routes.forEach(({ Path, router }) => {
  app.use(`/api/v1${Path}`, router);
});

app.all("*", (req, res, next) => {
  next(new SendError(`The route ${req.originalUrl} doesn't exists `, 400));
});

//2-Global Error Handling
app.use(errorHandling);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`App Running at ${PORT}`);
});

// handle rejections errors
process.on("unhandledRejection", (error) => {
  console.error(`unhandled Errors: ${error.name} | ${error.message}`);
  server.close(() => {
    console.error("closing server...");
    process.exit(1);
  });
});
