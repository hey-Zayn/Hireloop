const logger = require('./logger');

/**
 * A wrapper for sensitive controller actions to provide automatic audit logging.
 * @param {string} actionName - Descriptive name of the action (e.g., 'DELETE_COMPANY')
 * @param {Function} fn - The controller function to wrap
 */
const withAuditLog = (actionName, fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);

            // Log successful sensitive action
            logger.info(`AUDIT_LOG: [${actionName}] performed by user: ${req.user?._id || 'ANONYMOUS'} on resource: ${req.params?.id || 'GLOBAL'}`);
        } catch (error) {
            // Error is handled by global error handler, but we log the attempt
            logger.warn(`AUDIT_LOG_ATTEMPT: [${actionName}] failed for user: ${req.user?._id || 'ANONYMOUS'}. Error: ${error.message}`);
            throw error;
        }
    };
};

module.exports = withAuditLog;
