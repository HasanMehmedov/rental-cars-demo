const Joi = require('joi');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const router = express.Router();
const { User } = require('../models/user');

router.post('/', async (req, res) => {

    try {
        validateAuth(req.body);
        const user = await validateEmail(req.body.email);
        await validatePassword(user, req.body.password);

        const token = jwt.sign({ id: user._id, name: user.name }, config.get('jwtPrivateKey'));
        res.send(token);
    }
    catch (err) {
        res.status(err.status).send(err.message);
    }
});

function validateAuth(auth) {
    const validationSchema = {
        email: Joi.string().email().min(5).max(255).required(),
        password: Joi.string().min(8).max(1024).required()
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
        const validationError = new Error('Invalid email or password.');
        validationError.status = 400;
        throw validationError;
    }

    return user;
}

async function validatePassword(user, password) {

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        const validationError = new Error('Invalid email or password.');
        validationError.status = 400;
        throw validationError;
    }
}

module.exports = router;