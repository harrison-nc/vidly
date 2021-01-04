const bcrypt = require('bcrypt');
const { User, validate } = require('../models/user');

async function create(value) {
    const salt = await bcrypt.genSalt(10);

    return await new User({
        name: value.name,
        email: value.email,
        password: await bcrypt.hash(value.password, salt),
    }).save();
}

async function get(id) {
    return await User.findById(id).select('-password');
}

async function getByEmail(email) {
    return await User.findOne({ email: email });
}

exports.create = create;
exports.get = get;
exports.getByEmail = getByEmail;
exports.validate = validate;
