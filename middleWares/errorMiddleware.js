const sendErrorHandleForDev = (error, res) =>
  res.status(error.statusCode).json({
    status: error.status,
    error,
    message: error.message,
    stack: error.stack,
  });
const sendErrorHandleForProd = (error, res) =>
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
  });

// @decs    Handle the global Error for the whole app
const globalError = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "Error";
  if (process.env.NODE_ENV === "development") {
    sendErrorHandleForDev(error, res);
  } else {
    sendErrorHandleForProd(error, res);
  }
};

module.exports = globalError;
