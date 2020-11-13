const express = require('express');
const { Customer, validateCustomer } = require('../models/customer');
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

    if(!customer) {
        const notFoundError = new Error(`Customer with ID: ${id} was not found.`);
        notFoundError.status = 404;
        throw notFoundError;
    }

    return customer;
}

module.exports = router;