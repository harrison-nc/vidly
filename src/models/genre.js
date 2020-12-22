const mongoose = require('mongoose');
const Joi = require('joi');

const Schema = mongoose.Schema;

const genreSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
        trim: true,
    }
});

const Genre = mongoose.model('genre', genreSchema);

const inputSchema = Joi.object({ name: Joi.string().min(3).required() }).label('genre').required();

function validateGenre(genre) {
    return inputSchema.validate(genre);
}

exports.Genre = Genre;
exports.schema = genreSchema;
exports.validate = validateGenre;
