const express = require('express');
const router = express.Router();
const auth = require('../../src/middleware/auth');
const validator = require('../middleware/validateRequestParameters');
const { lookup, returnRental, validate: validateRental } = require('../db/rental');

const validateParams = validator(validateRental);

router.post('/', [auth, validateParams], async (req, res) => {
    let rental = await lookup(req.body.customerId, req.body.movieId)

    if (!rental) return res.status(404).send('Rental not found for the given customer and movie');

    if (rental.dateReturned) return res.status(400).send('Return already processed.');

    rental = await returnRental(rental);

    res.status(200).send(rental);
});

module.exports = router;
