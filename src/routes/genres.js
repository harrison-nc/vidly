const auth = require('../middleware/auth');
const express = require('express');
const { create, update, remove, getAll, get, validate } = require('../db/genre');

const router = express.Router();
router.use(express.json());

// Get the list of genres;
router.get('/', async (req, res) => {
    const genres = await getAll();
    res.send(genres);
});

// Get a genre using id
router.get('/:id', async (req, res) => {
    const genre = await get(req.params.id);
    if (!genre) return res.status(404).send("The genre with the given id was not found.");

    res.send(genre);
});

// Add a new genre to the list
router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await create(req.body.name);

    res.send(genre);
});

// Update a genre
router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return req.status(400).send(error.details[0].message);

    const genre = await update(req.params.id, req.body.name);
    if (!genre) return res.status(404).send("The genre with the given id was not found.");

    res.send(genre);
});

// Delete a genre
router.delete('/:id', async (req, res) => {
    const genre = await remove(req.params.id);
    if (!genre) return res.status(404).send("The genre with the given id was not found.");

    res.send(genre);
});

module.exports = router;
