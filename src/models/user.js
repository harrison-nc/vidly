const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255,
        trim: true,
        set: v => v.toLowerCase(),
    },
    email: {
        type: String,
        unique: true,
        required: true,
        minlength: 6,
        maxlength: 255,
        trim: true,
        set: v => v.toLowerCase(),
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        trim: true,
    }
});

const User = mongoose.model('user', userSchema);

const inputSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    passwordAgain: Joi.string().required(),
}).label('user').required();

function validateUser(user) {
    return inputSchema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
