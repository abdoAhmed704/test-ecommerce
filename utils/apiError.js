// @decs   for opretional errors 
class ApiError extends Error{
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = statusCode >= 400 ? 'fail' : 'pass'; 
    }

}

module.exports = ApiError;