const auth = require('../../src/middleware/auth');
const moment = require('moment');
const express = require('express');
const router = express.Router();
const { Rental } = require('../models/rental');
const { Movie } = require('../models/movie');

router.post('/', auth, async (req, res) => {
    if (!req.body.customerId) return res.status(400).send('customerId not provided.');
    if (!req.body.movieId) return res.status(400).send('movieId not provided.');

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
