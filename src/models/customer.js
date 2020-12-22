const mongoose = require('mongoose');
const Joi = require('joi');

const Schema = mongoose.Schema;

const Customer = mongoose.model('customer', new Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
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
    }
}));

function validateCustomer(customer, checkRequiredFields = true) {
    if (!customer) {
        return {
            error: {
                details: [
                    {
                        message: 'A customer object with the required fields must be given.',
                    }
                ]
            }
        }
    } else if (checkRequiredFields) {
        return Joi.validate(customer, {
            name: Joi.string().required(),
            phone: Joi.string().required(),
            isGold: Joi.boolean(),
        });
    } else {
        return Joi.validate(customer, {
            name: Joi.string(),
            phone: Joi.string(),
            isGold: Joi.boolean(),
        });
    }
}

exports.Customer = Customer;
exports.validate = validateCustomer;
