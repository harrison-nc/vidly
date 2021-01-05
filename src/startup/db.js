const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');

module.exports = async function () {
    await mongoose.connect(config.get('db.url'), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    });

    winston.info("Connected to MongoDB...");
}
