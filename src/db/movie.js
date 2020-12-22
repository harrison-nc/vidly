const { Movie, validate, validateGenre } = require('../models/movie');

async function getMovies() {
    const movies = await Movie.find().sort('name');
    return movies;
}

async function getMovie(id) {
    const movie = await Movie.findById(id);
    return movie;
}

async function createMovie(newMovie) {
    const movie = new Movie(newMovie);
    return await movie.save();
}

async function updateMovie(id, movie) {
    return await Movie.findByIdAndUpdate(id, {
        $set: { ...movie }
    }, { new: true, useFindAndModify: false });
}

async function updateMovieGenre(id, name) {
    return await Movie.findByIdAndUpdate(id,
        { $set: { 'genre.name': name } },
        { new: true, useFindAndModify: false });
}

async function removeMovieGenre(id) {
    return await Movie.findByIdAndUpdate(id,
        { $unset: { 'genre': '' } },
        { new: true, useFindAndModify: false });
}

async function removeMovie(id) {
    return await Movie.findByIdAndRemove(id, { useFindAndModify: false });
}

exports.create = createMovie;
exports.update = updateMovie;
exports.updateGenre = updateMovieGenre;
exports.removeGenre = removeMovieGenre;
exports.remove = removeMovie;
exports.getAll = getMovies;
exports.get = getMovie;
exports.validate = validate;
exports.validateGenre = validateGenre;
