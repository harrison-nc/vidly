const mongoose = require('mongoose');
const Joi = require('joi');

const Schema = mongoose.Schema;

const customerSchema = new Schema({
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
});

const Customer = mongoose.model('customer', customerSchema);

const inputSchema = Joi.object({
    name: Joi.string().required().min(4).max(30),
    phone: Joi.string().min(5).max(15).required(),
    isGold: Joi.boolean(),
}).label('customer').required();

function validateCustomer(customer) {
    return inputSchema.validate(customer);
}

exports.Customer = Customer;
exports.schema = customerSchema;
exports.validate = validateCustomer;
