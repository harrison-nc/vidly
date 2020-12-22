const mongoose = require('mongoose');
const Joi = require('joi');
const express = require('express');

const Schema = mongoose.Schema;
const router = express.Router();

router.use(express.json());

const Genre = mongoose.model('genre', new Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
    }
}));

async function createGenre(name) {
    const genre = new Genre({ name: name });
    return await genre.save();
}

async function getGenres() {
    return await Genre.find().sort('name');
}

async function getGenre(id) {
    return await Genre.findById(id);
}

async function updateGenre(id, name) {
    const options = { useFindAndModify: false, new: true };
    const genre = Genre.findByIdAndUpdate(id, { name: name }, options);
    return genre;
}

async function removeGenre(id) {
    return Genre.findByIdAndRemove(id, { useFindAndModify: false });
}

function validateGenre(genre) {
    const schema = { name: Joi.string().min(3).required(), };
    return Joi.validate(genre, schema);
}

// Get the list of genres;
router.get('/', async (req, res) => {
    const genres = await getGenres();
    res.send(genres);
});

// Get a genre using id
router.get('/:id', async (req, res) => {
    const genre = await getGenre(req.params.id);
    if (!genre) return res.status(404).send("The genre with the given id was not found.");

    res.send(genre);
});

// Add a new genre to the list
router.post('/', async (req, res) => {
    const { error } = validateGenre(req.body);
    if (error) return req.status(400).send(error.details[0].message);

    const genre = await createGenre(req.body.name);

    res.send(genre);
});

// Update a genre
router.put('/:id', async (req, res) => {
    const { error } = validateGenre(req.body);
    if (error) return req.status(400).send(error.details[0].message);

    const genre = await updateGenre(req.params.id, req.body.name);
    if (!genre) return res.status(404).send("The genre with the given id was not found.");

    res.send(genre);
});

// Delete a genre
router.delete('/:id', async (req, res) => {
    const genre = await removeGenre(req.params.id);
    if (!genre) return res.status(404).send("The genre with the given id was not found.");

    res.send(genre);
});

module.exports = router;
