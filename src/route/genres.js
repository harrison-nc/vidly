const Joi = require('joi');
const express = require('express');
const router = express.Router();

router.use(express.json());

const genres = [
    { id: 1, name: 'Action' },
    { id: 2, name: 'Horror' },
    { id: 3, name: 'Romance' },
];

// Get the list of genres;
router.get('/', (req, res) => {
    res.send(genres);
});

// Add a new genre to the list
router.post('/', (req, res) => {
    const { error } = validateGenre(req.body);
    if (error) return req.status(400).send(error.details[0].message);

    const genreName = req.body.name;
    const genreid = genres.length + 1;
    const genre = { id: genreid, name: genreName };
    genres.push(genre);
    res.send(genre);
});

// Get a genre using id
router.get('/:id', (req, res) => {
    const genre = getGenre(req.params.id);
    if (!genre) return res.status(404).send("The genre with the given id was not found.");

    res.send(genre);
});

// Update a genre
router.put('/:id', (req, res) => {
    const genre = getGenre(req.params.id);
    if (!genre) return res.status(404).send("The genre with the given id was not found.");

    const { error } = validateGenre(req.body);
    if (error) return req.status(400).send(error.details[0].message);

    const genreName = req.body.name;
    genre.name = genreName;
    res.send(genre);
});

// Delete a genre
router.delete('/:id', (req, res) => {
    const genre = getGenre(req.params.id);
    if (!genre) return res.status(404).send("The genre with the given id was not found.");

    const index = genres.indexOf(genre);
    genres.splice(index, 1);
    res.send(genre);
});

function getGenre(id) {
    return genres.find(g => g.id === parseInt(id));
}

function validateGenre(genre) {
    const schema = { name: Joi.string().min(3).required(), };
    return Joi.validate(genre, schema);
}

module.exports = router;
