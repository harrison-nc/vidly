require('express-async-errors');
const winston = require('winston');
require('winston-mongodb');
const mongoose = require('mongoose');
const genres = require('./routes/genres');
const config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const error = require('./middleware/error');
const express = require('express');

winston.handleExceptions(new winston.transports.File({
    filename: config.get('log.exfilename')
}))

process.on('unhandledRejection', (ex) => {
    console.log('unhandled rejections');
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

const app = express();
app.use(express.json());

async function main() {
    await mongoose.connect(config.get('db.url'), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    });

    console.log('Connected to database.');

    app.use('/api/genres', genres);
    app.use('/api/customers', customers);
    app.use('/api/movies', movies);
    app.use('/api/rentals', rentals);
    app.use('/api/users', users);
    app.use('/api/logins', auth);
    app.use(error);

    const port = parseInt(config.get('db.port')) || 3000;
    app.listen(port, () => console.log(`Listening on port ${port}...`));
}

main();
