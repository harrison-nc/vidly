const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const config = require('config');
const express = require('express');

require('./startup/logging')();
require('./startup/config')();
const db = require('./startup/db');
const routes = require('./startup/routes');

async function main() {
    const app = express();

    await db();
    routes(app);

    const port = parseInt(config.get('db.port')) || 3000;
    app.listen(port, () => console.log(`Listening on port ${port}...`));
}

main();
