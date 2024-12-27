// @decs    opretional errors
class SendError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode >= 400 ? "fail" : "success";
  }
}

module.exports = SendError;
