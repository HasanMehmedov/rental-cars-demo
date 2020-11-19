const Joi = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlenght: 2,
        maxlength: 255
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 1024
    }
});

const User = mongoose.model('User', userSchema);

async function validateUser(user) {
    const validationSchema = {
        name: Joi.string().min(2).max(255).required(),
        email: Joi.string().email().min(5).max(255).required(),
        password: Joi.string().min(8).max(1024).required()
    }

    const { error } = Joi.validate(user, validationSchema);
    if (error) {
        const validationError = new Error(error.details[0].message);
        validationError.status = 400;
        throw validationError;
    }

    const emailAlreadyTaken = await User.findOne({ email: user.email });
    if(emailAlreadyTaken) {
        const emailAlreadyTakenError = new Error('Email\'s already taken.');
        emailAlreadyTakenError.status = 400;
        throw emailAlreadyTakenError;
    }
}

module.exports.User = User;
module.exports.validateUser = validateUser;