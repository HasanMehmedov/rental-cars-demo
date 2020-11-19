const mongoose = require('mongoose');
const { User, validateUser } = require('../models/user');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {

    try {
        await validateUser(req.body);

        const result = await createUser(req.body);
        res.send(result);
    }
    catch (err) {
        res.status(err.status).send(err.message);
    }
});

async function createUser(params) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(params.password, salt);

    const user = new User({
        name: params.name,
        email: params.email,
        password: hashedPassword
    });

    await user.save();

    return {
        name: user.name,
        email: user.email
    };
}

module.exports = router;