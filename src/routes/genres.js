const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const express = require('express');
const { create, update, remove, getAll, get, validate } = require('../db/genre');
const validateObjectId = require('../middleware/validateObjectId');
const validator = require('../middleware/validateRequestParameters');

const router = express.Router();
const validateParams = validator(validate);

// Get the list of genres;
router.get('/', async (req, res) => {
    const genres = await getAll();
    res.send(genres);
});

// Get a genre using id
router.get('/:id', validateObjectId, async (req, res) => {
    const genre = await get(req.params.id);
    if (!genre) return res.status(404).send("The genre with the given id was not found.");

    res.send(genre);
});

// Add a new genre to the list
router.post('/', [auth, validateParams], async (req, res) => {
    const genre = await create(req.body.name);

    res.send(genre);
});

// Update a genre
router.put('/:id', [auth, validateObjectId, validateParams], async (req, res) => {
    const genre = await update(req.params.id, req.body.name);
    if (!genre) return res.status(404).send("The genre with the given id was not found.");

    res.send(genre);
});

// Delete a genre
router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
    const genre = await remove(req.params.id);
    if (!genre) return res.status(404).send("The genre with the given id was not found.");

    res.send(genre);
});

module.exports = router;
