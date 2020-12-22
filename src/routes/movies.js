const express = require('express');
const { create, update, updateGenre, removeGenre, remove, getAll, get, validate, validateGenre } = require('../db/movie');

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
    const newMovie = req.body.movie;

    const { error } = validate(newMovie);
    if (error) return res.status(400).send(error.details[0].message);

    const movie = await create(newMovie);
    if (!movie) return res.status(404).send('The given movie is invalid.');

    res.send(movie);
});

router.put('/:id', async (req, res) => {
    const newMovie = req.body.movie;

    const { error } = validate(newMovie, false);
    if (error) return res.status(400).send(error.details[0].message);

    const movie = await update(req.params.id, newMovie);

    if (!movie) return res.status(404).send('The movie with the given id was not found.');

    res.send(movie);
});

router.put('/:id/genre', async (req, res) => {
    const { error } = validateGenre({ name: req.body.name });
    if (error) return res.status(400).send(error.details[0].message);

    const movie = await updateGenre(req.params.id, req.body.name);

    if (!movie) return res.status(404).send('The movie with the given id was not found.');

    res.send(movie);
});

router.delete('/:id/genre', async (req, res) => {
    const movie = await removeGenre(req.params.id);

    if (!movie) return res.status(404).send('The movie with the given id was not found.');

    res.send(movie);
});

router.delete('/:id', async (req, res) => {
    const movie = await remove(req.params.id);

    if (!movie) return res.status(404).send('The movie with the given id was not found.');

    res.send(movie);
});

module.exports = router;
