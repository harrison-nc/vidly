const mongoose = require('mongoose');
const Joi = require('joi');

const Schema = mongoose.Schema;

const genreSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 50,
        trim: true,
    }
});

const movieSchema = new Schema({
    title: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 50,
        trim: true,
    },
    genre: {
        type: genreSchema,
        required: true,
    },
    numberInStock: {
        type: Number,
        default: 0,
        min: 0,
    },
    dailyRentalRate: {
        type: Number,
        default: 0,
        min: 0,
    }
});

const genreJoi = Joi.string().min(4).max(50);

function validateMovie(movie, checkRequiredField = true) {
    if (!movie) {
        return {
            error: {
                details: [{ message: 'A movie object with required properties must be given' }]
            }
        };
    }

    const genreSchema = { name: genreJoi.required() }

    const title = Joi.string().min(4).max(50);
    const genre = Joi.object(genreSchema);
    const numberInStock = Joi.number().min(0);
    const dailyRentalRate = Joi.number().min(0);

    if (checkRequiredField) {
        return Joi.validate(movie, {
            title: title.required(),
            genre: genre.required(),
            numberInStock: numberInStock,
            dailyRentalRate: dailyRentalRate,
        });
    } else {
        return Joi.validate(movie, {
            title: title,
            genre: genre,
            numberInStock: numberInStock,
            dailyRentalRate: dailyRentalRate,
        });
    }
}

function validateMovieGenre(movieGenre) {
    if (movieGenre) return Joi.validate(movieGenre, { name: genreJoi.required() });
    else return Joi.validate(movieGenre, { name: genreJoi });
}

const Movie = mongoose.model('movie', movieSchema);

exports.Movie = Movie;
exports.validate = validateMovie;
exports.validateGenre = validateMovieGenre;
