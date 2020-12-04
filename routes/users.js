const { User, validateUser } = require('../models/user');
const auth = require('../middlewares/auth');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();

router.post('/me', auth, async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    res.send(user);
});

router.post('/', async (req, res) => {

    try {
        await validateUser(req.body);

        const result = await createUser(req.body);
        const token = result.generateAuthToken();
        res.header('x-auth-token', token).send({ name: result.name, email: result.email });
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
        password: hashedPassword,
        isAdmin: params.isAdmin
    });

    await user.save();

    return user;
}

module.exports = router;