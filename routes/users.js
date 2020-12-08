const { User, validateUser } = require('../models/user');
const auth = require('../middlewares/auth');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const SYSTEM_ERROR_MESSAGE = 'Something failed.';

router.post('/me', auth, async (req, res) => {

    const userId = req.user.id;

    const user = await getUser(userId);
    res.send(user);
});

router.post('/', async (req, res) => {

    await validateUser(req.body);

    const result = await createUser(req.body);
    const token = result.generateAuthToken();
    res.header('x-auth-token', token).send({ name: result.name, email: result.email });
});

async function getUser(id) {

    let user;
    try {
        user = await User.findById(id).select('-password');
    }
    catch (err) {
        const systemError = new Error(SYSTEM_ERROR_MESSAGE);
        systemError.status = 500;
        throw systemError;
    }

    if (!user) {
        const notFoundError = new Error(`User with ID: ${id} was not found.`);
        notFoundError.status = 404;
        throw notFoundError;
    }

    return user;
}

async function createUser(params) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(params.password, salt);

    const user = new User({
        name: params.name,
        email: params.email,
        password: hashedPassword,
        isAdmin: params.isAdmin
    });

    try {
        await user.save();
    }
    catch (err) {
        const systemError = new Error(SYSTEM_ERROR_MESSAGE);
        systemError.status = 500;
        throw systemError;
    }

    return user;
}

module.exports = router;