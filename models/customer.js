const mongoose = require('mongoose');
const Joi = require('joi');
const PHONE_NUMBER_REGEX = /^\d{6,10}$/;

const customerSchema = new mongoose.Schema({
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
        maxlength: 10,
        validate: {
            validator: function (v) {
                return v.match(PHONE_NUMBER_REGEX);
            },
            message: 'Invalid phone number'
        }
    }
});

const Customer = mongoose.model('Customer', customerSchema);

function validateCustomer(customer) {
    const validationSchema = {
        name: Joi.string().min(2).max(255).required(),
        email: Joi.string().min(5).max(255).email(),
        phone: Joi.string().min(6).max(10).regex(new RegExp(PHONE_NUMBER_REGEX)).required()
            .error(errors => {
                errors.forEach(error => {
                    if (error.type === 'string.regex.base') {
                        error.message = 'Invalid phone number.';
                    }
                });

                return errors;
            })
    }

    const { error } = Joi.validate(customer, validationSchema);
    if(error) {
        const validationError = new Error(error.details[0].message);
        validationError.status = 400;
        throw validationError;
    }
}

module.exports.Customer = Customer;
module.exports.validateCustomer = validateCustomer;