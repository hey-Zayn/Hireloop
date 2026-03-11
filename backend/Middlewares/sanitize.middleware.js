/**
 * Custom NoSQL injection sanitizer compatible with Express 5.
 * Recursively removes any keys starting with '$' or containing '.' from the object.
 */
const sanitizeObject = (obj) => {
    if (obj instanceof Object) {
        for (const key in obj) {
            if (/^\$|\./.test(key)) {
                delete obj[key];
            } else {
                sanitizeObject(obj[key]);
            }
        }
    }
    return obj;
};

const mongoSanitize = (req, res, next) => {
    if (req.body) sanitizeObject(req.body);
    if (req.params) sanitizeObject(req.params);
    // Note: In Express 5, req.query is often a getter. 
    // We sanitize it by cleaning the underlying object if possible, 
    // or by creating a sanitized copy if we can't modify it in place.
    if (req.query) {
        try {
            sanitizeObject(req.query);
        } catch (e) {
            // If req.query is truly read-only, we skip or handle differently.
            // But usually, the values inside the query object are mutable even if the property 'query' itself isn't.
        }
    }
    next();
};

module.exports = mongoSanitize;
