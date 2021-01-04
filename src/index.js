const mongoose = require('mongoose');
const genres = require('./routes/genres');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const express = require('express');

const app = express();

async function main() {
    await mongoose.connect('mongodb://localhost/vidly', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    app.use('/api/genres', genres);
    app.use('/api/customers', customers);
    app.use('/api/movies', movies);
    app.use('/api/rentals', rentals);

    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Listening on port ${port}...`));
}

main();
