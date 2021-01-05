require('express-async-errors');
const winston = require('winston');
require('winston-mongodb');
const mongoose = require('mongoose');
const config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const express = require('express');
const db = require('./startup/db');
const routes = require('./startup/routes');

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

if (!config.get('jwtPrivateKey')) {
    console.log('FATAL ERROR: jwtPrivateKey not defined.');
    process.exit(1);
}

if (!config.get('db.url')) {
    console.log('FATAL ERROR: Database url not defined.');
    process.exit(1);
}


async function main() {
    const app = express();

    await db();
    routes(app);

    const port = parseInt(config.get('db.port')) || 3000;
    app.listen(port, () => console.log(`Listening on port ${port}...`));
}

main();
