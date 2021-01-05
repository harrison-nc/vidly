const config = require('config');
const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');

module.exports = function () {
    if (!config.get('log.exfilename')) {
        winston.handleExceptions(
            new winston.transports.Console({ colorized: true, prettyPrint: true }));
    }
    else {
        winston.handleExceptions(
            new winston.transports.Console({ colorized: true, prettyPrint: true }),
            new winston.transports.File({ filename: config.get('log.exfilename') }))
    }

    process.on('unhandledRejection', (ex) => {
        throw ex;
    });

    if (config.get('log.filename')) {
        winston.add(winston.transports.File, {
            filename: config.get('log.filename')
        });
    }
    else winston.warn('log.filename is not defined.');

    if (config.get('log.db.url')) {
        winston.add(winston.transports.MongoDB, {
            db: config.get('log.db.url'),
            level: 'info',
        });
    }
    else winston.warn('log.db.url is not defined.');
}
