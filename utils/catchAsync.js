/**
 * Wraps async route handlers to pass unhandled promise rejections to the global error handling middleware.
 * This helps avoid boilerplate try-catch blocks in every controller function.
 * 
 * @param {Function} fn - The asynchronous route handler or middleware.
 * @returns {Function} Express middleware function with error catching.
 */
module.exports = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
