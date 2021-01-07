const config = require('config');
const winston = require('winston');
const express = require('express');
const app = express();

require('./startup/logging')();
require('./startup/config')();
require('./startup/db')();
require('./startup/validation')();
require('./startup/routes')(app);

const port = parseInt(config.get('port')) || 3000;
app.listen(port, () => winston.info(`Listening on port ${port}...`));
