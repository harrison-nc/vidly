const mongoose = require('mongoose');
const Joi = require('joi');

const Schema = mongoose.Schema;

const Rental = mongoose.model('rental', new Schema({
    customer: {
        type: new Schema({
            name: {
                type: String,
                required: true,
                minlength: 4,
                maxlength: 30,
                trim: true,
            },
            phone: {
                type: String,
                minlength: 5,
                maxlength: 15,
                required: true,
                trim: true,
            },
            isGold: {
                type: Boolean,
                default: false,
                set: v => v ? true : false,
                get: v => v ? true : false,
            }
        }),
        required: true,
    },
    movie: {
        type: new Schema({
            title: {
                type: String,
                required: true,
                minlength: 4,
                maxlength: 50,
                trim: true,
            },
            dailyRentalRate: {
                type: Number,
                default: 0,
                min: 0,
                max: 255,
                set: v => v ? v : 0,
                get: v => v ? v : 0,
            },
            dateOut: {
                type: Date,
                required: true,
                default: Date.now,
            },
            dateReturned: {
                type: Date,
            },
            rentalFee: {
                type: Number,
                min: 0
            }
        }),
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
