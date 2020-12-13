const express = require('express');
const cars = require('../routes/cars');
const customers = require('../routes/customers');
const rentals = require('../routes/rentals');
const users = require('../routes/users');
const auth = require('../routes/auth');
const home = require('../routes/home');
const error = require('../middlewares/error');

module.exports = function (app) {
    app.use(express.json());
    app.use('/api/cars', cars);
    app.use('/api/customers', customers);
    app.use('/api/rentals', rentals);
    app.use('/api/users', users);
    app.use('/api/auth', auth);
    app.use('/', home);
    app.use(error);
}