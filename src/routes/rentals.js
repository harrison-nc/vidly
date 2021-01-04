const asyncMiddleware = require('../middleware/async');
const auth = require('../middleware/auth');
const express = require('express');
const rentals = require('../db/rental');
const { get: getCustmer } = require('../db/customer');
const { get: getMovie } = require('../db/movie');

const router = express.Router();
router.use(express.json());

router.get('/', asyncMiddleware(async (req, res) => {
    const rental = await rentals.getAll();
    res.send(rental);
}));

router.get('/:id', asyncMiddleware(async (req, res) => {
    const rental = await rentals.get(req.params.id);

    if (!rental) return res.status(404).send('The rental with the given id was not found.');

    res.send(rental);
}));

router.post('/', auth, asyncMiddleware(async (req, res) => {
    const { error } = rentals.validate(req.body.rental);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await getCustmer(req.body.rental.customerId);
    if (!customer) return res.status(404).send('The customer with the given id was not found.');

    const movie = await getMovie(req.body.rental.movieId);
    if (!movie) return res.status(400).send('The movie with the given id was not found.');

    if (movie.numberInStock == 0) return res.status(400).send('The movie is out of stock.');

    const rental = await rentals.create(customer, movie);
    res.send(rental);
}));

module.exports = router;
