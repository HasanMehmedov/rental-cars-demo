const mongoose = require('mongoose');
const { User, validateUser } = require('../models/user');
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
    const user = new User({
        name: params.name,
        email: params.email,
        password: params.password
    });

    const result = await user.save();
    return result;
}

module.exports = router;