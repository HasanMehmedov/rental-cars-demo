require('express-async-errors');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const config = require('config');
const cars = require('./routes/cars');
const customers = require('./routes/customers');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const home = require('./routes/home');
const error = require('./middlewares/error');

if (!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: jwtPrivateKey is not defined.');
    process.exit(1);
}

app.use(express.json());
app.use('/api/cars', cars);
app.use('/api/customers', customers);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/', home);
app.use(error);

mongoose.connect('mongodb://localhost/cars', { poolSize: 100 })
    .then(() => console.log('Succesfully connected to MongoDB...'))
    .catch(() => console.error('Could not connect to the database.'));

const port = process.env.port || 3000;

app.listen(port, () => console.log(`Listening on port ${port}...`));