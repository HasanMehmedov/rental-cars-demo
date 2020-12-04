const Joi = require('joi');
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { User } = require('../models/user');
const INVALID_EMAIL_OR_PASSWORD_MESSAGE = 'Invalid email or password.';

router.post('/', async (req, res) => {

    try {
        validateAuth(req.body);
        const user = await validateEmail(req.body.email);
        await validatePassword(user, req.body.password);

        const token = user.generateAuthToken();
        res.header('x-auth-token', token).send({ name: user.name, email: user.email });
    }
    catch (err) {
        res.status(err.status).send(err.message);
    }
});

function validateAuth(auth) {
    const validationSchema = {
        email: Joi.string().email().min(5).max(255).required(),
        password: Joi.string().min(8).max(255).required()
    }

    const { error } = Joi.validate(auth, validationSchema);
    if (error) {
        const validationError = new Error(error.details[0].message);
        validationError.status = 400;
        throw validationError;
    }
}

async function validateEmail(email) {
    const user = await User.findOne({ email: email });
    if (!user) {
        const validationError = new Error(INVALID_EMAIL_OR_PASSWORD_MESSAGE);
        validationError.status = 400;
        throw validationError;
    }

    return user;
}

async function validatePassword(user, password) {

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        const validationError = new Error(INVALID_EMAIL_OR_PASSWORD_MESSAGE);
        validationError.status = 400;
        throw validationError;
    }
}

module.exports = router;