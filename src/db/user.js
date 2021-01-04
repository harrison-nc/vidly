const { User, validate } = require('../models/user');

async function create(value) {
    return await new User({
        name: value.name,
        email: value.email,
        password: value.password,
    }).save();
}

exports.create = create;
exports.validate = validate;
