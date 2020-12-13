const express = require('express');
require('express-async-errors');
const app = express();
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const winston = require('winston');

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();

const port = process.env.port || 3000;
app.listen(port, () => winston.info(`Listening on port ${port}...`));