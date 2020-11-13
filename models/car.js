const Joi = require('joi');
const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    year: {
        type: Number,
        required: true,
        min: 1900
    }
});

const Car = mongoose.model('Car', carSchema);

function validateCar(car) {
    const validationSchema = {
        name: Joi.string().min(3).required(),
        year: Joi.number().min(1900).required()
    }

    const { error } = Joi.validate(car, validationSchema);
    if (error) {
        const validationError = new Error(error.details[0].message);
        validationError.status = 400;
        throw validationError;
    }
}

module.exports.Car = Car;
module.exports.validateCar = validateCar;