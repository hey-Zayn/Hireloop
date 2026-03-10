/**
 * Wraps an asynchronous function to catch any errors and pass them to the next middleware (error handler).
 * Eliminates the need for try-catch blocks in every controller.
 */
const catchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = catchAsync;
