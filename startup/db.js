const winston = require('winston');
const mongoose = require('mongoose');

module.exports = function () {
    mongoose.connect('mongodb://localhost/cars', { poolSize: 100 })
        .then(() => winston.info('Succesfully connected to MongoDB...'));
}