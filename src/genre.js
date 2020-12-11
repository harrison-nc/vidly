const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const genres = [];

// Get the list of genres;
app.get('/api/genres', (req, res) => {
    res.send(genres);
});

// Get a genre using id
app.get('/api/genres/:id', (req, res) => {
    const genre = getGenre(req.params.id);
    if (!genre) return res.status(404).send("The genre with the given id was not found.");

    res.send(genre);
});

// Add a new genre to the list
app.post('/api/genres', (req, res) => {
    const { error } = validateGenre(req.body);
    if (error) return req.status(400).send(error.details[0].message);

    const genreName = req.body.name;
    const genreid = genres.length + 1;
    const genre = { id: genreid, name: genreName };
    genres.push(genre);
    res.send(genre);
});


// Update a genre
app.put('/api/genres/:id', (req, res) => {
    const genre = getGenre(req.params.id);
    if (!genre) return res.status(404).send("The genre with the given id was not found.");

    const { error } = validateGenre(req.body);
    if (error) return req.status(400).send(error.details[0].message);

    const genreName = req.body.name;
    genre.name = genreName;
    res.send(genre);
});

// Delete a genre
app.delete('/api/genres/:id', (req, res) => {
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

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
