const { Movie, validate, validateGenre } = require('../models/movie');

async function getMovies() {
    const movies = await Movie.find().sort('name');
    return movies;
}

async function getMovie(id) {
    const movie = await Movie.findById(id);
    return movie;
}

async function createMovie(movie, genre) {
    const newMovie = new Movie({
        title: movie.title,
        genre: {
            _id: genre._id,
            name: genre.name,
        },
        numberInStock: movie.numberInStock,
        dailyRentalRate: movie.dailyRentalRate,
    });
    return await newMovie.save();
}

async function updateMovie(id, movie, genre) {
    return await Movie.findByIdAndUpdate(id, {
        $set: {
            title: movie.title,
            genre: {
                _id: genre._id,
                name: genre.name,
            },
            numberInStock: movie.numberInStock,
            dailyRentalRate: movie.dailyRentalRate,
        }
    }, { new: true, useFindAndModify: false });
}

async function removeMovie(id) {
    return await Movie.findByIdAndRemove(id, { useFindAndModify: false });
}

exports.create = createMovie;
exports.update = updateMovie;
exports.remove = removeMovie;
exports.getAll = getMovies;
exports.get = getMovie;
exports.validate = validate;
