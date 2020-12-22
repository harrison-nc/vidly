const express = require('express');
const { create, update, remove, getAll, get, validate } = require('../db/movie');
const { get: getGenre } = require('../db/genre');

const router = express.Router();
router.use(express.json());

router.get('/', async (req, res) => {
    const movies = await getAll();
    res.send(movies);
});

router.get('/:id', async (req, res) => {
    const movie = await get(req.params.id);

    if (!movie) return res.status(404).send('The movie this the given id was not found.');

    res.send(movie);
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body.movie);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await getGenre(req.body.movie.genreId);

    if (!genre) return res.status(404).send('The given genre does not exist.');

    const movie = await create(req.body.movie, genre);
    res.send(movie);
});

router.put('/:id', async (req, res) => {
    const { error } = validate(req.body.movie);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await getGenre(req.body.movie.genreId);
    if (!genre) return res.status(404).send('The given genre does not exist.');

    const movie = await update(req.params.id, req.body.movie, genre);
    if (!movie) return res.status(404).send('The movie with the given id was not found.');

    res.send(movie);
});

router.delete('/:id', async (req, res) => {
    const movie = await remove(req.params.id);

    if (!movie) return res.status(404).send('The movie with the given id was not found.');

    res.send(movie);
});

module.exports = router;
