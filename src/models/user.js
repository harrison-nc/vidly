const mongoose = require('mongoose');
const Joi = require('joi');
const config = require('config');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
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
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
    return token;
}

const User = mongoose.model('User', userSchema);

const inputSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(255).required(),
    passwordAgain: Joi.string().required(),
    isAdmin: Joi.boolean()
}).label('user').required();

function validateUser(user) {
    return inputSchema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
