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

if (!config.get('jwtPrivateKey')) {
    console.log('FATAL ERROR: jwtPrivateKey not defined.');
    process.exit(1);
}

const app = express();

async function start() {
    await mongoose.connect('mongodb://localhost/vidly', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    console.log('Connected to database.');

    app.use('/api/genres', genres);
    app.use('/api/customers', customers);
    app.use('/api/movies', movies);
    app.use('/api/rentals', rentals);
    app.use('/api/users', users);
    app.use('/api/logins', auth);
    app.use(error);

    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Listening on port ${port}...`));
}

async function main() {
    try {
        await start();
    } catch (ex) {
        console.log(ex);
    }
}

main();
