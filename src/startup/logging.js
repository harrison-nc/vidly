const config = require('config');
const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');

module.exports = function () {
    winston.handleExceptions(new winston.transports.File({
        filename: config.get('log.exfilename')
    }))

    process.on('unhandledRejection', (ex) => {
        throw ex;
    });

    winston.add(winston.transports.File, {
        filename: config.get('log.filename')
    });

    winston.add(winston.transports.MongoDB, {
        db: config.get('log.db.url'),
        level: 'info',
    });
}
