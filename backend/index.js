require('dotenv').config();
const validateEnv = require('./Config/env');
const logger = require('./libs/logger');
const app = require('./app');

validateEnv();


const PORT = process.env.PORT || 3000;



app.listen(PORT, () => {
    logger.info(`Server started on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

