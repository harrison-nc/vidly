const mongoose = require('mongoose');
const Joi = require('joi');

const Schema = mongoose.Schema;

const Genre = mongoose.model('genre', new Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
    }
}));

function validateGenre(genre) {
    const schema = { name: Joi.string().min(3).required(), };
    return Joi.validate(genre, schema);
}

exports.Genre = Genre;
exports.validate = validateGenre;
