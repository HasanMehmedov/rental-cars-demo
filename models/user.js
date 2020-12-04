const jwt = require('jsonwebtoken');
const config = require('config');
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
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ id: this._id, name: this.name, email: this.email, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
    return token;
}

const User = mongoose.model('User', userSchema);

async function validateUser(user) {
    const validationSchema = {
        name: Joi.string().min(2).max(255).required(),
        email: Joi.string().email().min(5).max(255).required(),
        password: Joi.string().min(8).max(255).required(),
        isAdmin: Joi.boolean()
    }

    const { error } = Joi.validate(user, validationSchema);
    if (error) {
        const validationError = new Error(error.details[0].message);
        validationError.status = 400;
        throw validationError;
    }

    const emailExists = await User.findOne({ email: user.email });
    if (emailExists) {
        const emailExistsError = new Error('Email\'s already taken.');
        emailExistsError.status = 400;
        throw emailExistsError;
    }
}

module.exports.User = User;
module.exports.validateUser = validateUser;