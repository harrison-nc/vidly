const mongoose = require('mongoose');
const Joi = require('joi');

const { schema: customerSchema } = require('./customer');
const { schema: movieSchema } = require('./movie');

const Schema = mongoose.Schema;

const Rental = mongoose.model('rental', new Schema({
    customer: {
        type: customerSchema,
        required: true,
    },
    movie: {
        type: movieSchema,
        required: true,
    }
}));

const inputSchema = Joi.object({
    customerId: Joi.string().required(),
    movieId: Joi.string().required(),
}).label('rental').required();

function validateRental(rental) {
    return inputSchema.validate(rental);
}

exports.Rental = Rental;
exports.validate = validateRental;
