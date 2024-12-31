// @decs    Handle the global Error (any arror in the app)
const errorHandling = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";
  if (process.env.NODE_ENV === "dev") {
     res.status(error.statusCode).json({
       status: error.status,
       error,
       message: error.message,
       stack: error.stack,
     });
  }
};

module.exports = errorHandling;
