const mongoose = require('mongoose');
const Joi = require('joi');

const User = mongoose.model('User', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
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
        maxlength: 1024,
        trim: true,
    }
}));

const inputSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(6).max(255).required(),
    password: Joi.string().min(6).max(255).required(),
    passwordAgain: Joi.string().required(),
}).label('user').required();

function validateUser(user) {
    return inputSchema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
