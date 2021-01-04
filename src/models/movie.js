const mongoose = require('mongoose');
const Joi = require('joi');
const { schema: genreSchema } = require('./genre');

const Schema = mongoose.Schema;

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
        max: 255,
        set: v => v ? v : 0,
        get: v => v ? v : 0,
    },
    dailyRentalRate: {
        type: Number,
        default: 0,
        min: 0,
        max: 255,
        set: v => v ? v : 0,
        get: v => v ? v : 0,
    }
});

const Movie = mongoose.model('movie', movieSchema);

const inputSchema = Joi.object({
    title: Joi.string().min(4).max(50).required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().min(0),
    dailyRentalRate: Joi.number().min(0),
}).label('movie').required();

function validateMovie(movie) {
    return inputSchema.validate(movie);
}

exports.Movie = Movie;
exports.validate = validateMovie;
exports.schema = movieSchema;
