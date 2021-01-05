const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const config = require('config');
const express = require('express');

require('./startup/logging');
const db = require('./startup/db');
const routes = require('./startup/routes');

if (!config.get('jwtPrivateKey')) {
    console.log('FATAL ERROR: jwtPrivateKey not defined.');
    process.exit(1);
}

if (!config.get('db.url')) {
    console.log('FATAL ERROR: Database url not defined.');
    process.exit(1);
}

async function main() {
    const app = express();

    await db();
    routes(app);

    const port = parseInt(config.get('db.port')) || 3000;
    app.listen(port, () => console.log(`Listening on port ${port}...`));
}

main();
