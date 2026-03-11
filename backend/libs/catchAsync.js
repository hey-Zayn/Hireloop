/**
 * A wrapper for asynchronous route handlers to catch errors and pass them to the global error handler.
 * Eliminates the need for repetitive try-catch blocks in every controller.
 */
const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

module.exports = catchAsync;
