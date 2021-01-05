const winston = require('winston');

module.exports = function (err, req, res, next) {
    // error, warn, info, debug, silly, verbose
    winston.error(err.message, err);

    res.status(500).send('Something went wrong.');
}
