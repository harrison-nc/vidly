const config = require('config');

module.exports = function () {
    if (!config.get('jwtPrivateKey')) {
        throw new Error('FATAL ERROR: jwtPrivateKey not defined.');
    }

    if (!config.get('db')) {
        throw new Error('FATAL ERROR: Database url not defined.');
    }
}
