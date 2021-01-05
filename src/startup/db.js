const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');

module.exports = function () {
    mongoose.connect(config.get('db.url'), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    }).then(() => winston.info("Connected to MongoDB..."));
}
