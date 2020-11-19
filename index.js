const express = require('express');
const mongoose = require('mongoose');
const app = express();
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const cars = require('./routes/cars');
const customers = require('./routes/customers');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const home = require('./routes/home');

app.use(express.json());
app.use('/api/cars', cars);
app.use('/api/customers', customers);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/', home);

mongoose.connect('mongodb://localhost/cars')
    .then(() => console.log('Succesfully connected to MongoDB...'))
    .catch(() => console.error('Could not connect to the database.'));

const port = process.env.port || 3000;

app.listen(port, () => console.log(`Listening on port ${port}...`));