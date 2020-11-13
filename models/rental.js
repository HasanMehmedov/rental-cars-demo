const mongoose = require('mongoose');
const PHONE_NUMBER_REGEX = /^\d{6,10}$/;
const Joi = require('joi');

const rentalSchema = new mongoose.Schema({
    customer: new mongoose.Schema({
        name: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 255
        },
        email: {
            type: String,
            minlength: 5,
            maxlength: 255
        },
        phone: {
            type: String,
            required: true,
            minlength: 6,
            maxlength: 255,
            validate: {
                validator: function (v) { return v.match(PHONE_NUMBER_REGEX); },
                message: 'Invalid phone number'
            }
        }
    }),
    car: new mongoose.Schema({
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
    }),
    dateOut: {
        type: Date,
        required: true,
        default: Date.now()
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number,
        positive: true
    }
});

const Rental = mongoose.model('Rental', rentalSchema);

function validateRental(rental) {
    const validationSchema = {
        customerId: Joi.objectId().required(),
        carId: Joi.objectId().required()
    }

    const { error } = Joi.validate(rental, validationSchema);
    if(error) {
        const validationError = new Error(error.details[0].message);
        validationError.status = 400;
        throw validationError;
    }
}

module.exports.Rental = Rental;
module.exports.validateRental = validateRental;