const moment = require('moment');
const express = require('express');
const router = express.Router();

const auth = require('../../src/middleware/auth');
const validator = require('../middleware/validateRequestParameters');
const { Rental } = require('../models/rental');
const { Movie } = require('../models/movie');
const { validate: validateReturn } = require('../models/returns');

const validate = validator(validateReturn);

router.post('/', [auth, validate], async (req, res) => {
    let rental = await get(req.body.customerId, req.body.movieId)
    if (!rental) return res.status(404).send('Rental not found for the given customer and movie');

    if (rental.dateReturned) return res.status(400).send('Return already processed.');

    rental = await returnRental(rental);

    res.status(200).send(rental);
});

function get(customerId, movieId) {
    return Rental.findOne({
        'customer._id': customerId,
        'movie._id': movieId,
    });
}

async function returnRental(rental) {
    rental.dateReturned = Date.now();
    const rentalDays = moment().diff(rental.dateOut, 'days');
    rental.rentalFee = rentalDays * rental.movie.dailyRentalRate;
    const updatedRental = await rental.save();

    const movie = await Movie.findByIdAndUpdate(rental.movie._id, {
        $inc: { numberInStock: 1 }
    });

    await movie.save();

    return updatedRental;
}

module.exports = router;
