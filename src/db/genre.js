
const { Genre, validate } = require('../models/genre');

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

exports.create = createGenre;
exports.getAll = getGenres;
exports.get = getGenre;
exports.update = updateGenre;
exports.remove = removeGenre;
exports.validate = validate;
