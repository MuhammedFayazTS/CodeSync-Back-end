const ErrorHandler = require("../Utils/ErrorHandler");

const isAuthenticated = (req,res,next) => {
    const token = req.cookies["connect.sid"];
    if(!token) {
        return next(new ErrorHandler("Not Logged in",401));
    }

    next()
}

module.exports = isAuthenticated