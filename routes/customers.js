const express = require('express');
const { Customer, validateCustomer } = require('../models/customer');
const auth = require('../middlewares/auth');
const router = express.Router();

router.get('/', async (req, res) => {

    try {
        const customers = await getCustomers();
        res.send(customers);
    }
    catch (err) {
        res.status(err.status).send(err.message);
    }
});

router.get('/:id', async (req, res) => {
    const customerId = req.params.id;

    try {
        const customer = await getCustomer(customerId);
        res.send(customer);
    }
    catch (err) {
        res.status(err.status).send(err.message);
    }
});

router.post('/', auth, async (req, res) => {

    try {
        validateCustomer(req.body);

        const result = await createCustomer(req.body);
        res.send(result);
    }
    catch (err) {
        res.status(err.status).send(err.message);
    }
});

router.put('/:id', auth, async (req, res) => {
    const customerId = req.params.id;

    try {
        const result = await updateCustomer(customerId, req.body);
        res.send(result);
    }
    catch (err) {
        res.status(err.status).send(err.message);
    }
});

router.delete('/:id', auth, async (req, res) => {
    const customerId = req.params.id;

    try {
        const result = await deleteCustomer(customerId);
        res.send(result);
    }
    catch (err) {
        res.status(err.status).send(err.message);
    }
});

async function getCustomers() {
    const customers = await Customer.find();

    if (!customers || customers.length === 0) {
        const notFoundError = new Error('There are no saved customers.');
        notFoundError.status = 404;
        throw notFoundError;
    }

    return customers;
}

async function getCustomer(id) {
    const customer = await Customer.findById(id);

    if (!customer) {
        const notFoundError = new Error(`Customer with ID: ${id} was not found.`);
        notFoundError.status = 404;
        throw notFoundError;
    }

    return customer;
}

async function createCustomer(params) {
    const customer = new Customer({
        name: params.name,
        email: params.email,
        phone: params.phone
    });

    const result = await customer.save();
    return result;
}

async function updateCustomer(id, params) {
    const customer = await getCustomer(id);

    if (!params.name) {
        params.name = customer.name;
    }

    if (!params.email) {
        params.email = customer.email;
    }

    if (!params.phone) {
        params.phone = customer.phone;
    }

    validateCustomer(params);

    customer.set({
        name: params.name,
        email: params.email,
        phone: params.phone
    });

    const result = await customer.save();
    return result;
}

async function deleteCustomer(id) {
    const customer = await getCustomer(id);
    await Customer.deleteOne({ _id: id });
    return customer;
}

module.exports = router;