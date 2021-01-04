const { User, validate } = require('../models/user');

async function create(value) {
    return await new User({
        name: value.name,
        email: value.email,
        password: value.password,
    }).save();
}

async function getByEmail(email) {
    return await User.findOne({ email: email });
}

exports.create = create;
exports.getByEmail = getByEmail;
exports.validate = validate;
