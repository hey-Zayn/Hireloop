const logger = require('../libs/logger');

const requiredEnvs = [
    'PORT',
    'MONGO_URL',
    'JWT_SECRET',
    'EMAIL_USER',
    'EMAIL_PASS'
];

const validateEnv = () => {
    const missing = requiredEnvs.filter(env => !process.env[env]);

    if (missing.length > 0) {
        logger.error(`Missing required environment variables: ${missing.join(', ')}`);
        process.exit(1);
    }

    logger.info('Environment variables validated successfully');
};

module.exports = validateEnv;
