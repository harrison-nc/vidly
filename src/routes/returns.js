const auth = require('../../src/middleware/auth');
const express = require('express');
const router = express.Router();
const { Rental } = require('../models/rental');

router.post('/', auth, async (req, res) => {
    if (!req.body.customerId) return res.status(400).send('customerId not provided.');
    if (!req.body.movieId) return res.status(400).send('movieId not provided.');

    const rental = await get(req.body.customerId, req.body.movieId)
    if (!rental) return res.status(404).send('Rental not found for the given customer and movie');

    if (rental.dateReturned) return res.status(400).send('Return already processed.');

    res.status(200).send();
});

function get(customerId, movieId) {
    return Rental.findOne({
        'customer._id': customerId,
        'movie._id': movieId,
    });
}

module.exports = router;
